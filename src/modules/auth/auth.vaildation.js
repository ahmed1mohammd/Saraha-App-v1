import joi from "joi"
import { generalFields } from "../../middleware/vaildation.middleware.js";
import { logout } from "../user/user.vaildation.js";
// ======================= vaildation =======================

export const signup = {
  body: joi.object({
    fullName: generalFields.fullName,
    email: generalFields.email,
    password: generalFields.password,
    confirmPassword: generalFields.confirmPassword,
    phone: generalFields.phone,
    otp: generalFields.otp,
  }).required()
};

export const forgotPassword = {
  body: joi.object({
    email: generalFields.email,
  }).required()
};

export const verifyforgotPassword = {
  body : forgotPassword.body.append({
    otp: generalFields.otp.required(),
  })
}

export const resetPassword = {
  body : forgotPassword.body.append({
    otp: generalFields.otp.required(),
   password: generalFields.password.required(),
   confirmPassword: generalFields.confirmPassword.required(), 
  })
}

export const updatePassword = {
  body : logout.body.append({
  oldPassword: generalFields.password.required(),
   password: generalFields.password.required(),
  })
}

