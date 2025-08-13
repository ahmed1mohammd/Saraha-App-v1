import fs from "fs";
import path from "path";
import multer from "multer";

export const fileValidation = {
  Image: ["image/jpeg", "image/jpg", "image/png"],
  Video: ["video/mp4", "video/mpeg", "video/quicktime"],
  Audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  Document: ["application/pdf", "application/msword"]
};

export const cloudFileUpload = ({validation = [],maxSize = 2 * 1024 * 1024 } = {}) => {

  const storage = multer.diskStorage({})

  const fileFilter = function (req, file, callback) {
    if (Array.isArray(validation) && validation.length > 0) {
      if (validation.includes(file.mimetype)) {
        return callback(null, true);
      }
      return callback(
        new Error(
          `File type not allowed. Allowed types: ${validation.join(", ")}`
        )
      );
    }
    return callback(null, true);
  };

  return multer({
    dest: "./temp",
    fileFilter,
    storage,
    limits: { fileSize: maxSize }
  });
};
