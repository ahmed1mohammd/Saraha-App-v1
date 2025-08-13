
import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema({
  content:{
    type: String,
    minLength: 1,
    maxLength: 20000,
    required: function() {
      return this.attachments?.length ? false: true;
  }},
  attachments:[{ secure_url: String, public_id: String }],
   receiverId:{type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
   senderId:{type: mongoose.Schema.Types.ObjectId, ref: "user"},

}
,{
    timestamps: true,
})

export const MessageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);