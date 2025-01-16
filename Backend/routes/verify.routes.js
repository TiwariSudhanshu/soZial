import { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/mail.controllers.js";

const router = Router();

router.route('/sendOTP').post(sendOTP);
router.route('/verifyOTP').post(verifyOTP);

export default router;