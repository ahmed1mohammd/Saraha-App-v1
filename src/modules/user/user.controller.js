import * as userService from './user.service.js'
import {authentication, authorization} from "../../middleware/auth.middleware.js"
import { endPoint } from './authorization.user.js';
import {Router } from 'express'
import { validation } from '../../middleware/vaildation.middleware.js';
import * as vaildators from './user.vaildation.js';
import { fileValidation, localFileUpload } from '../../utils/multer/local.multer.js';
import { cloudFileUpload } from '../../utils/multer/cloud.multer.js';
const router = Router({ caseSensitive: true, strict:true });

router.post("/logout", authentication,validation(vaildators.logout), userService.logout);
router.get("/" , authentication, authorization(endPoint.profile), userService.profile)
router.get("" , validation(vaildators.shareProfile), userService.shareProfile)
router.patch("/", authentication, validation(vaildators.updateProfile), userService.updateProfile);
router.delete("/:userId/freeze-account", authentication,  validation(vaildators.freezeAccount), userService.freezeAccount);
router.patch("/:userId/restore-account", authentication, authorization(endPoint.restoreAccount), validation(vaildators.restoreAccount), userService.restoreAccount);
router.delete("/:userId/hard-delete", authentication, authorization(endPoint.hardDeleteAccount), userService.hardDeleteAccount);
router.patch("/profile-image", authentication, cloudFileUpload({ vaildation: fileValidation.Image , maxSize: 2 * 1024 * 1024 }).single("image"), userService.updateProfileImage);
router.patch("/profilecover-image", authentication,cloudFileUpload({ vaildation: fileValidation.Image }).array("images",2), userService.updateProfileCoverImage);


export default router



