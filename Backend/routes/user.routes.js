import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { suggestions } from "../controllers/suggestions.controllers.js";
import { addNewPost, deletePost } from "../controllers/post.controllers.js";
import { changeInfo, changePassword, fetchUser } from "../controllers/edit.controllers.js";
import { fetchInitalStatus, like } from "../controllers/likes.controllers.js";
import { fetchFollowDetails, follow, unfollow } from "../controllers/follow.controllers.js";

const router = Router();

router.route("/register").post( upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]) ,registerUser)

router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT ,logoutUser);
router.route("/suggestions").get(suggestions)

router.route("/post").post(upload.fields([
    {
        name: "postImage",
        maxCount: 1
    }
]),verifyJWT,addNewPost)

router.route("/post/delete").post(verifyJWT, deletePost)
router.route("/like").post(verifyJWT, like)
router.route("/fetchLike").post(fetchInitalStatus);
router.route("/follow").post(verifyJWT,follow)
router.route("/followStatus").post(verifyJWT, fetchFollowDetails)
router.route("/unfollow").post(verifyJWT, unfollow)

router.route('/edit').get(verifyJWT, fetchUser)
router.route("/edit/change").post(verifyJWT,upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), changeInfo)
router.route("/edit/changePassword").post(verifyJWT,changePassword);


export default router;