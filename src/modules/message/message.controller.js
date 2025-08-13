import { Router } from "express";
import * as messageServive from "./message.service.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";
import { fileValidation } from "../../utils/multer/cloud.multer.js"
import * as vaildators  from'./message.vaildation.js' 
import { validation } from "../../middleware/vaildation.middleware.js";
import { authentication } from "../../middleware/auth.middleware.js";




const router = Router({ caseSensitive: true, strict:true });


router.post(
  "/:receiverId",cloudFileUpload({ validation: fileValidation.Image }).array("attachments", 2),
  validation(vaildators.sendMessage),
  messageServive.sendMessage
);


router.post(
  "/:receiverId/sender", authentication, cloudFileUpload({ validation: fileValidation.Image }).array("attachments", 2),
  validation(vaildators.sendMessage),
  messageServive.sendMessage
);


router.get(
  "/:messageId",
  authentication,
  validation(vaildators.getMessageById),
  messageServive.getMessageById
);


router.delete(
  "/:messageId",
  authentication,
  validation(vaildators.deleteMessage),
  messageServive.deleteMessage
);

export default router;