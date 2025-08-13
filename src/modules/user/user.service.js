import { AsyncHandler, successResponse } from "../../utils/response.js";
import {decryptEncryption, generateEncryption} from "../../utils/security.js/encryption.security.js"
import * as DBservice from '../../DB/db.service.js'
import { UserModel } from "../../DB/models/user.model.js";
import { roleEnum } from "../../DB/models/user.model.js";
import { logoutEnum } from "../../utils/security.js/token.security.js";
import { cloud, deleteFiles, deleteSingle, deletFolderByPrefix, uploadFiles, uploadsingle } from "../../utils/multer/cloudnairy.js";


export const logout = AsyncHandler(
  async (req , res , next )=>{
    const {flag} = req.body;
    let status = 200;
    switch (flag) {
      case logoutEnum.signoutFromAll :
       await DBservice.updateOne({
          model:UserModel,
          filter:{_id:req.decoded._id},
          data:{changeCredentialsTime: new Date()}
        })
        break;
    
      default:
       await createRevokedToken({req})
      status = 201; 
        break;
    }
  
    return successResponse({res,status, data:{}})
})

export const profile = AsyncHandler(
  async (req , res , next )=>{
     const user = await DBservice.findById({
      model:UserModel,
      id:req.user._id,
      populate:[{path:"messages"}]
     })

    user.phone = await decryptEncryption ({cipherText:req.user.phone})
    return successResponse({res, data:{user}})
})

export const shareProfile = AsyncHandler(
  async (req , res , next )=>{
   const {userId} = req.params;
   const user = await DBservice.findOne({
    model:UserModel,
    filter: {
        _id:userId,
        confirmEmail:{$exists: true}
    }
   })
    return user ? successResponse({res, data:{user}}):
     next (new Error("In-vaild Account"))
})  

export const updateProfile = AsyncHandler(
    async (req , res , next )=>{
   if (req.body.phone) {
        req.body.phone = await generateEncryption({plaintext: req.body.phone})
    }
   const user = await DBservice.findOneAndUpdate({
    model:UserModel,
    filter: { _id: req.user._id },
    data: req.body,
})
    return user ? successResponse({res, data:{user}}):
     next (new Error("In-vaild Account"))
})
 
export const freezeAccount = AsyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    if (userId && req.user.role !== roleEnum.admin) {
      return next(new Error("You are not allowed to freeze this account", { cause: 403 }));
    }
    const user = await DBservice.findOneAndUpdate({
      model: UserModel,
      filter: { _id: userId || req.user._id, deletedAt: { $exists: false } },
      data: {
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    });

    return user
      ? successResponse({ res, data: { user } })
      : next(new Error("In-vaild Account"));
  }
);

export const restoreAccount = AsyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    const user = await DBservice.findOneAndUpdate({
      model: UserModel,
      filter: { 
        _id: userId,
        deletedAt: { $exists: true },
        deletedBy: {$ne:userId}
    },
      data: {
        $unset:{
            deletedAt:1,
            deletedBy: 1
        },
       restoredAt: new Date(),
       restoredBy: req.user._id,    
      }
    });

    return user
      ? successResponse({ res, data: { user } })
      : next(new Error("In-vaild Account"));
  }
);

export const hardDeleteAccount = AsyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;

    const user = await DBservice.deleteOne({
      model: UserModel,
      filter: { _id: userId, deletedAt: { $exists: true } },
    });

    if (user.deletedCount) {
      
      await deletFolderByPrefix({ prefix: `user/${userId}` });

  
      await cloud().api.delete_folder(`${process.env.APPLICATION_NAME}/user/${userId}`);
    }

    return user.deletedCount
      ? successResponse({ res, data: { user } })
      : next(new Error("In-vaild Account"));
  }
);

export const updateProfileImage = AsyncHandler(
  async (req, res, next) => {
  const { secure_url, public_id } = await uploadsingle({
    file: req.file,
    path: `user/${req.user._id}`
  });

  const user = await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { picture: { secure_url, public_id } },
    Options: { new: false }
  });

  if (user?.picture?.public_id) {
    const oldPublicId = user.picture.public_id;
    await deleteSingle({ public_id: oldPublicId });
  }

  return (
    successResponse({res,data:{user: {_id: req.user._id,email: req.user.email,firstName: req.user.firstName, profilePic: { secure_url, public_id }}}
    }) || next(new Error("Invalid Account"))
  );
});

export const updateProfileCoverImage = AsyncHandler(
  async (req, res, next) => {
  if (!req.files?.length) {return next(new Error("No files uploaded"))}

  const uploadedImages = await Promise.all(
    req.files.map(file =>uploadsingle({file,path: `user/${req.user._id}/cover`})))

  const user = await DBservice.findOne({
    model: UserModel,
    filter: { _id: req.user._id }})

  if (user?.coverPic?.length) {
    const oldPublicIds = user.coverPic.map(img => img.public_id);
    await deleteFiles({ public_ids: oldPublicIds })}

  const updatedUser = await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { coverPic: uploadedImages },
    Options: { new: true }
  })

  return successResponse({ res,data: {user: {_id: updatedUser._id,email: updatedUser.email,firstName: updatedUser.firstName,coverPic: updatedUser.coverPic
      }
    }
  });
});
