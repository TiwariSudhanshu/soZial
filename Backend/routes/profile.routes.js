import { Router } from "express";
import { findUserById, findUserByUsername } from "../controllers/profile.controllers.js";


const router = Router();


router.route("/profile").post(findUserById);
router.route("/search").post(findUserByUsername);
router.route("/fetch").post(findUserByUsername);

export default router;