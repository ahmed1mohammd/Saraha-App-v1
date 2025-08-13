
import mongoose from "mongoose";


export const genderEnum = { male: "male", female: "female" };
export const roleEnum = { user: "User", admin: "Admin" };
export const providerEnum = { system: "system", google: "google" };



export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [20, "firstName max length is 20 char and you have entered {VALUE}"]
  },
  LastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [20, "LastName max length is 20 char and you have entered {VALUE}"]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function(){
      console.log({DOC:this});
      return this.provider === providerEnum.system ? true  : false;
    }
  },
  gender: {
    type: String,
    enum: {
      values: Object.values(genderEnum),
      message: `Gender only allows ${Object.values(genderEnum)}`
    },
    default: genderEnum.male
  },
  provider:{
    type:String,
    enum: Object.values(providerEnum),
    default: providerEnum.system
  },
   role: {
    type: String,
    enum: {
      values: Object.values(roleEnum),
      message: `role only allows ${Object.values(roleEnum)}`
    },
    default: roleEnum.user
  },
refresh_token: {
  type: String,
},
refreshTokenExpires: {
  type: Date,
  default: null
},
confirmEmail: {
  type: Boolean,
  default: false,
},


otp: {
  type: String,
  default: null
},

forgotPasswordotp: {
  type: String,
},

otpExpires: {
  type: Date,
  default: null
},
failedOTPAttempts: {
  type: Number,
  default: 0
},
otpBlockedUntil: {
  type: Date,
  default: null
},

picture:{secure_url:String , public_id:String},
coverPic:[{secure_url:String , public_id:String}],
deletedAt: Date,
deletedBy:{type: mongoose.Schema.Types.ObjectId, ref: "user"},

restoredAt: Date,
restoredBy:{type: mongoose.Schema.Types.ObjectId, ref: "user"},

  phone: String,
  changeCredentialsTime:Date,
   


}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


userSchema.virtual("fullname")
  .get(function () {
    return `${this.firstName} ${this.LastName}`;
  });

  userSchema.virtual('messages',{
    localField:"_id",
    foreignField:"receiverId",
    ref:"Message"
  })

export const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
