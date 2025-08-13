import joi from "joi";
import { generalFields } from "../../middleware/vaildation.middleware.js";

export const sendMessage = {
  params: joi.object({
    receiverId: generalFields.id.required()
  }).required(),

  body: joi.object({
    content: joi.string().min(2).max(20000)
  }).required(),

  files: joi.array()
    .items(
      joi.object({
        fieldname: joi.string().valid('attachments').required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().positive().required()
      })
    )
    .min(0)
    .max(2)
};

export const getMessageById = {
  params: joi.object({
    messageId: joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
  }).required()
};

export const deleteMessage = {
  params: joi.object({
    messageId: joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
  }).required()
};
