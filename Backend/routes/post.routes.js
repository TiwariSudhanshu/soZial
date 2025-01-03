import { Router } from "express";
import { addNewPost, deletePost } from "../controllers/post.controllers.js";
import { bookmark, getAllBookMark } from "../controllers/bookmark.controllers.js";
import {  like, likeStatus } from "../controllers/likes.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route("/add").post(upload.fields([
    {
        name: "postImage",
        maxCount: 1
    }
]),verifyJWT,addNewPost)
router.route("/bookmark").post(verifyJWT, bookmark)
router.route("/getAllBookmarks").get(verifyJWT, getAllBookMark)
router.route("/delete").post(verifyJWT, deletePost)
router.route("/like").post(verifyJWT, like)
router.route("/likeStatus").post(likeStatus);

export default router;
