import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication } from "../../middleware/auth.middleware.js"; 
import * as authVaildation from './auth.vaildation.js'
import { validation } from "../../middleware/vaildation.middleware.js";

const router = Router({ caseSensitive: true, strict:true });


router.post("/signup", validation(authVaildation.signup) ,authService.signup);
router.post("/signup/gmail", authService.signupWithGmail);
router.post("/login/gmail", authService.loginWithGmail);
router.patch("/forgot-password", validation(authVaildation.forgotPassword), authService.forgotPassword);
router.patch("/verify-forgot-password", validation(authVaildation.verifyforgotPassword), authService.verifyforgotPassword);
router.patch("/reset-password", validation(authVaildation.resetPassword), authService.resetPassword);
router.post('/confirm-otp', authService.confirmOTP);
router.post("/login", authService.login);
router.post("/refresh", authService.refreshToken);
router.patch("/update-password", authentication, authService.updatePassword);

export default router;

