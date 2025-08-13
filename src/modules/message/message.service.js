import { AsyncHandler, successResponse } from "../../utils/response.js";
import { uploadFiles } from "../../utils/multer/cloudnairy.js";
import * as Dbservice from "../../DB/db.service.js";
import { UserModel } from "../../DB/models/user.model.js";
import { MessageModel } from "../../DB/models/message.model.js";


export const sendMessage = AsyncHandler(
  async (req, res, next) => {

    if (!req.body.content && !req.files ) {
      return next(new Error("Message Content Is Required"))
    }

 const { receiverId } = req.params;
    if (!await Dbservice.findOne({
      model:UserModel,
      filter:{
               _id: receiverId,
               deletedAt:{$exists:false},
               confirmEmail:{$exists:true}
               
      }
    })) {
      return next (new Error("invaild-Account",{cause:404}))
    }
    
 
    const { content } = req.body;
    let attachments =[];
    if (req.files) {
      attachments = await uploadFiles({files:req.files , path:`message/${receiverId}`})
    }
    const message = await Dbservice.create({
      model:MessageModel,
      data:[{
          content,
          attachments,
          receiverId,
          senderId: req.user?._id
      }]
    })
    return successResponse({ res, data: {message} });
  }
);

export const getMessageById = AsyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await MessageModel.findById(messageId);
  if (!message) {
    return next(new Error("Message not found", { cause: 404 }));
  }

  
  if (message.receiverId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to view this message", { cause: 403 }));
  }

  return successResponse({ res, message });
});


export const deleteMessage = AsyncHandler(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await MessageModel.findById(messageId);
  if (!message) {
    return next(new Error("Message not found", { cause: 404 }));
  }

  
  if (message.receiverId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to delete this message", { cause: 403 }));
  }

  await MessageModel.deleteOne({ _id: messageId });

  return successResponse({ res, message: "Message deleted successfully" });
});
