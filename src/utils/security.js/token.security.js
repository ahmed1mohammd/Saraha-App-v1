import jwt from "jsonwebtoken";
import * as Dbservise from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/user.model.js";
import cron from 'node-cron'
import { nanoid } from "nanoid";
import { TokenModel } from "../../DB/models/Token.model.js";
// Enums
export const signatureTypeEnum = { system: "System", bearer: "Bearer" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };
export const logoutEnum = { signoutFromAll: "signoutFromAll", signout: "signout" , stayloggedIn: "stayLoggedIn" };

// Generate Token

export const generateToken = ({
  payload,
  signature = process.env.ACCESS_TOKEN_USER_SIGNATURE,
  options = {},})=> {return jwt.sign(payload, signature, options);
};


// Verify Token
export const verifyToken = ({
  token,
  signature = process.env.ACCESS_TOKEN_USER_SIGNATURE,
}) => {
  return jwt.verify(token, signature);
};

// Get signatures based on role
export const getSignatures = async ({
  signatureLevel = signatureTypeEnum.bearer,
} = {}) => {
  let signatures = { accessSignature: "", refreshSignature: "" };

  switch (signatureLevel) {
    case signatureTypeEnum.system:
      signatures.accessSignature = process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE;
      signatures.refreshSignature = process.env.REFRESH_TOKEN_SYSTEM_SIGNATURE;
      break;

    default:
      signatures.accessSignature = process.env.ACCESS_TOKEN_USER_SIGNATURE;
      signatures.refreshSignature = process.env.REFRESH_TOKEN_USER_SIGNATURE;
      break;
  }

  return signatures;
};

// Decode Token + Get User
export const decodedToken = async ({
  authorization = "",
  tokenType = tokenTypeEnum.access,
  next,
} = {}) => {
  const [bearer, token] = authorization?.split(" ") || [];

  if (!token || !bearer) {
    return next(new Error("Missing token parts"));
  }

  const { accessSignature, refreshSignature } = await getSignatures({
    signatureLevel: bearer,
  });

  const decoded = verifyToken({
    token,
    signature:
      tokenType === tokenTypeEnum.access ? accessSignature : refreshSignature,
  });
   if (decoded.jti && await Dbservise.findOne({
    model: TokenModel,
    filter: { jwtid: decoded.jti },
   })) {
    return next(new Error("In-Vaild login data", { cause: 401 }));
   }

  if (!decoded?._id) {
    return next(new Error("Invalid token payload", { cause: 400 }));
  }

  const user = await Dbservise.findById({
    model: UserModel,
    id: decoded._id,
  });

  if (!user) {
    return next(new Error("Not registered account", { cause: 404 }));
  }

 if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000) {
  const error = new Error("Credentials changed, please login again");
  error.statusCode = 401;
  return next(error);
}

return { user, decoded };

};
//create revoked token
export const createRevokedToken  = async ({req} ={})=>{
        await Dbservise.create({
          model: TokenModel,
          data: [{
              jti: req.decoded.jti,
              expiresIn: req.decoded.iat + Number(process.env.REFRESH_EXPIRES_IN),
              userId: req.decoded._id
          }]
      })
      return {status: 201, message: "Token revoked successfully"};
}  

// Cron Job to delete expired refresh tokens
export const startTokenCleanupCron = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = Date.now();
      const result = await TokenModel.deleteMany({ expiresIn: { $lt: now } });
    } catch (err) {
    }
  });
};