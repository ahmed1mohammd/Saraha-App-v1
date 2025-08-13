import { providerEnum, UserModel } from "../../DB/models/user.model.js";
import { roleEnum } from "../../DB/models/user.model.js";
import { AsyncHandler, successResponse } from "../../utils/response.js";
import * as Dbservise from "../../DB/db.service.js";
import { comparHash, generateHash } from "../../utils/security.js/hash.security.js";
import { generateEncryption } from "../../utils/security.js/encryption.security.js";
import { generateToken, signatureTypeEnum, verifyToken ,getSignatures, logoutEnum, createRevokedToken} from "../../utils/security.js/token.security.js";
import { forgotPasswordotp, sendEmail } from "../../utils/email/email.sevice.js";
import { customAlphabet } from 'nanoid';
import { OAuth2Client } from "google-auth-library";
import { nanoid } from "nanoid";
import { emailTemplate } from "../../utils/email/templets/temp.email.js";


// ======================= Helper Methouds =======================
async function verify(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return payload;
}
async function generateloginToken (user){
  const signature = await getSignatures({
  signatureLevel:user.role != roleEnum.user ? signatureTypeEnum.system : signatureTypeEnum.bearer
})
  const jwtid = nanoid();
  const access_token = generateToken({
    payload: { _id: user._id },
    signature: signature.accessSignature,
    options: {
      jwtid,
      expiresIn: process.env.ACCESS_EXPIRES_IN },
  });

  const refresh_token = generateToken({
    payload: { _id: user._id },
    signature: signature.refreshSignature,
    options: {
      jwtid,
      expiresIn: process.env.REFRESH_EXPIRES_IN },
  });
 return {access_token , refresh_token};

}
// ======================= Signup =======================
export const signup = AsyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;
 
  if (await Dbservise.findOne({ model: UserModel, filter: { email } })) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  const hashPassword = await generateHash({ plaintext: password });
   const otp = customAlphabet("0123456789",6)()
   const hashotp = await generateHash({plaintext: otp});
  const encPhone = await generateEncryption({ plaintext: phone });
 
  const [firstName, LastName] = fullName.split(" ");
  const user = await Dbservise.create({
    model: UserModel,
    data: [{
      firstName,
      LastName,
      email,
      password: hashPassword,
      phone: encPhone,
      otp: hashotp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    }],
  });

 
sendEmail({
    to: email,
    subject: "Verify your Saraha account with OTP",
    html: emailTemplate({ username: user.firstName, otp }),
  });

  return successResponse({ res, status: 201,message: "Signup successfully", data: { user } });
});
// ======================= SignupWithGmail =======================
export const signupWithGmail = AsyncHandler(
  async (req, res, next) => {
    const { idToken } = req.body;

    const payload = await verify(idToken);
    const { email_verified, email, name, picture, given_name, family_name } = payload;

    if (!email_verified) {
      return next(new Error("Email not verified", { cause: 400 }));
    }

    const user = await Dbservise.findOne({
      model: UserModel,
      filter: { email },
    });

    if (user) {
      return next(new Error("Email already exists", { cause: 409 }));
    }

    const newUser = await Dbservise.create({
      model: UserModel,
      data: [{
        email,
        firstName: given_name,
        LastName: family_name,
        fullName: name,
        confirmEmail: true,
        provider: providerEnum.google,
        profileImage: picture, 
        role: "User" 
      }]
    });

    return successResponse({ res, status: 201, data: { user: newUser } });
  }
);
// ======================= loginWithGmail =======================
export const loginWithGmail = AsyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const payload = await verify(idToken);
  const { email_verified, email } = payload;

  if (!email_verified) {
    return next(new Error("Email not verified", { cause: 400 }));
  }

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.google },
  });

  if (!user) {
    return next(new Error("Invalid login data", { cause: 404 }));
  }

  const { access_token, refresh_token } = await generateloginToken(user);

  return successResponse({
    res,
    status: 200,
    data: {access_token, refresh_token, user: {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.LastName,
    profilePic: user.profilePic,
    provider: user.provider,
    role: user.role,
  }},
  });
});
// ======================= Login =======================
export const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.system },
  });

  if (!user) {
    return next(new Error("Invalid email or password or provider", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("Please confirm your email first", { cause: 403 }));
  }

  const match = await comparHash({
    plaintext: password,
    hashValue: user.password,
  });

  if (!match) {
    return next(new Error("Invalid email or password", { cause: 404 }));
  }

  const { access_token, refresh_token } = await generateloginToken(user);

  await Dbservise.updateOne({
    model: UserModel,
    filter: { _id: user._id },
    data: { refresh_token },
  });

  return successResponse({
    res, status: 200, data: { access_token, refresh_token,},});
});
// ======================= Refresh Token =======================
export const refreshToken = AsyncHandler(async (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return next(new Error("Refresh token is required", { cause: 400 }));
  }

  let decoded;
  let signature = await getSignatures({ signatureLevel: signatureTypeEnum.bearer }); 

  try {
    decoded = verifyToken({
      token: refresh_token,
      signature: signature.refreshSignature,
    });
  } catch {
    return next(new Error("Invalid refresh token", { cause: 401 }));
  }

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { _id: decoded._id, refresh_token },
  });

  if (!user) {
    return next(new Error("User not found or token mismatch", { cause: 404 }));
  }

  const access_token = generateToken({
    payload: { _id: user._id },
    signature: signature.accessSignature,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN },
  });

  return successResponse({
    res,
    message: "Access token generated successfully",
    data: { access_token },
  });
});
// ======================= Confirm OTP =======================
export const confirmOTP = AsyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) return next(new Error("User not found", { cause: 404 }));

  if (user.otpBlockedUntil && new Date() < user.otpBlockedUntil) {
    const remaining = Math.ceil((user.otpBlockedUntil - new Date()) / 1000);
    return next(
      new Error(`Too many failed attempts. Try again after ${remaining} seconds.`, {cause: 429})
    );
  }

  const validOTP = await comparHash({
    plaintext: otp,
    hashValue: user.otp?.toString(),
  });

  const isExpired = !user.otpExpires || new Date() > new Date(user.otpExpires);

  if (!validOTP || isExpired) {
    user.failedOTPAttempts += 1;

    if (user.failedOTPAttempts >= 5) {
      user.otpBlockedUntil = new Date(Date.now() + 5 * 60 * 1000); 
      user.failedOTPAttempts = 0;
    }

    await user.save();
    return next(new Error("Invalid or expired OTP", { cause: 400 }));
  }

  user.confirmEmail = true;
  user.otp = null;
  user.otpExpires = null;
  user.failedOTPAttempts = 0;
  user.otpBlockedUntil = null;

  await user.save();

  return successResponse({
    res,
    message: "Email verified successfully. Account is now activated.",
  });
});
// ======================= Update Password =======================
export const updatePassword = AsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { oldPassword, newPassword, flag } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const isMatch = await comparHash({
    plaintext: oldPassword,
    hashValue: user.password,
  });

  if (!isMatch) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }

let updatedDate = {}
  switch (flag) {
        case logoutEnum.signoutFromAll :
       updatedDate.changeCredentialsTime = new Date();
          break;
       case logoutEnum.signout :
       await createRevokedToken({req})
          break;

        default:
          break;
      }


  const hashedPassword = await generateHash({ plaintext: newPassword });
  user.password = hashedPassword;
  await user.save();
  return successResponse({res,status: 200,message: "Password updated successfully",
  });
});
// ======================= forgotPasswordOtp =======================
export const forgotPassword = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const otp = customAlphabet("0123456789", 6)();  
  const user = await Dbservise.findOneAndUpdate({
    model: UserModel,
    filter: { email , provider: providerEnum.system , confirmEmail: true , deletedAt: { $exists: false } },
    data: {
      forgotPasswordotp: await generateHash({ plaintext: otp }),
      changeCredentialsTime: new Date(),
      
    }
  })
  if (!user) {
    return next(new Error("User not found or email not confirmed", { cause: 404 }));
  }
 forgotPasswordotp({
    to: email,
    subject: "FORGOT PASSWORD OTP Saraha",
    html: emailTemplate({ username: user.firstName, otp }),
  });
return successResponse({
  res,
  status: 200,
  data: {
  user: {
  _id: user._id,
  email: user.email,
  gender: user.gender
    }
  }
});

});
// ======================= verifyforgotPassword =======================
export const verifyforgotPassword = AsyncHandler(async (req, res, next) => {
  const { email , otp } = req.body;

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { 
      email , 
      provider: providerEnum.system , 
      confirmEmail: true , 
      deletedAt: { $exists: false } ,
      forgotPasswordotp: { $exists: true },
    },
    
  })
  if (!user) {
    return next(new Error("User not found or email not confirmed", { cause: 404 }));
  }
  if (! await comparHash({
    plaintext: otp,
    hashValue: user.forgotPasswordotp,
  })) {
    return next(new Error("Invalid or expired OTP", { cause: 400 })); 
    
  }


return successResponse({
  res,
  status: 200,
  data: {
  user: {
  _id: user._id,
  email: user.email,
  gender: user.gender
    }
  }
});

});
// ======================= resetPassword =======================
export const resetPassword = AsyncHandler(async (req, res, next) => {
  const { email , otp ,password } = req.body;

  const user = await Dbservise.findOne({
    model: UserModel,
    filter: { 
      email , 
      provider: providerEnum.system , 
      confirmEmail: true , 
      deletedAt: { $exists: false } ,
      forgotPasswordotp: { $exists: true },
    },
    
  })
  if (!user) {
    return next(new Error("User not found or email not confirmed", { cause: 404 }));
  }
  if (! await comparHash({
    plaintext: otp,
    hashValue: user.forgotPasswordotp,
  })) {
    return next(new Error("Invalid or expired OTP", { cause: 400 })); 
    
  }

  await Dbservise.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      password: await generateHash({ plaintext: password }),
    },
  });


return successResponse({
  res,
  status: 200,
  data: {
  user: {
  _id: user._id,
  email: user.email,
  gender: user.gender
    }
  }
});

});