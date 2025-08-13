import { AsyncHandler } from "../utils/response.js";
import Joi from "joi";
import { Types } from "mongoose";
import { genderEnum } from "../DB/models/user.model.js";
import { fileValidation } from "../utils/multer/local.multer.js";

export const generalFields = {
  fullName: Joi.string()
    .pattern(new RegExp(/^[A-Z][a-z]{1,19}\s{1}[A-Z][a-z]{1,19}$/))
    .min(2)
    .max(20)
    .messages({
      "string.min": "min name length is 2 char",
      "any.required": "fullName is mandatory",
    }),
  email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["net", "com"] } }),
  password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  otp: Joi.string().pattern(new RegExp(/^\d{6}$/)),
  gender: Joi.string().valid(...Object.values(genderEnum)),
  id: Joi.string().custom((value, helper) => {
    if (!Types.ObjectId.isValid(value)) {
      return helper.message("Invalid ID");
    }
    return value;
  }).length(24),


  files: {
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination:Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),   
    size: Joi.number().positive().required()

  },

}



export const validation = (schema) => {
  return AsyncHandler(async (req, res, next) => {

     
    const validationErrors = [];

    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], { abortEarly: false });

      if (validationResult.error) {
        validationErrors.push(validationResult.error.details);
      }
    }

    if (validationErrors.length) {
      return res.status(409).json({
        err_message: "validation Error",
        error: validationErrors,
      });
    }

    return next();
  });
};
