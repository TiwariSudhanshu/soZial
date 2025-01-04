import { Router } from "express";
import { createMessage, getChat } from "../controllers/messages.controllers.js";

const router = Router();

router.route('/new').post(createMessage)
router.route('/get').post(getChat)

export default router;