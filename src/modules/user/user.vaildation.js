import joi from "joi";
import { generalFields } from "../../middleware/vaildation.middleware.js";
import { logoutEnum } from "../../utils/security.js/token.security.js";
import Joi from "joi";
import { fileValidation } from "../../utils/multer/local.multer.js";

// ======================= validation =======================



export const logout= {
  body: joi.object().keys({
    flag: joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayloggedIn)
  }).required()
};

export const shareProfile= {
  params: joi.object({
    userId: generalFields.id.required()
  })
};
export const updateProfile = {
     body: joi.object().keys({
        fullName: generalFields.fullName,
        phone: generalFields.phone,
        gender: generalFields.gender
     }).required()
}

export const freezeAccount= {
  params: joi.object({
    userId: generalFields.id
  })
};
 


export const restoreAccount= {
  params: joi.object({
    userId: generalFields.id.required()
  })
};
 

export const hardDeleteAccount= {
  params: joi.object({
    userId: generalFields.id.required()
  })
};
 
export const updateProfileCoverImage={
 files: joi.array().items(
  joi.object().keys(generalFields.files).required()
 ).min(1).max(2).required()
  
}