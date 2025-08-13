

import mongoose from "mongoose";

export const TokenSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, {
  timestamps: true,
});





export const TokenModel = mongoose.models.Token || mongoose.model("Token", TokenSchema);

