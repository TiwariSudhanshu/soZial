import { Router } from "express";
import { clearChat, createMessage, getChat } from "../controllers/messages.controllers.js";

const router = Router();

router.route('/new').post(createMessage)
router.route('/get').post(getChat)
router.route('/clear').post(clearChat)

export default router;