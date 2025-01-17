import { Router } from "express";
import { forgotPass, sendOTP, verifyOTP } from "../controllers/mail.controllers.js";

const router = Router();

router.route('/sendOTP').post(sendOTP);
router.route('/verifyOTP').post(verifyOTP);
router.route('/forgotPass').post(forgotPass)

export default router;