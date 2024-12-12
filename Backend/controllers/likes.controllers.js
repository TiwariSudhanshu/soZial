import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js";
import {Likes} from "../models/like.model.js";

export const like = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const {postId} = req.body;
    if (!user) {
      throw new ApiError(400, "No user found to like the post");
    }

    if (!postId) {
      throw new ApiError(400, "No postId found");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(500, "Post not found");
    }

    let like = await Likes.findOne({post: postId});

    if (!like) {
      like = new Likes({
        likeCount: 1,
        users: [user._id],
        post: postId,
      });
    } else {
      if (like.users.includes(user._id)) {
        like.users = like.users.filter(
          (id) => id.toString() !== user._id.toString()
        );
        like.likeCount -= 1;
        if (likeCount === 0) {
          await Likes.deleteOne({_id: like._id});
          post.likes = null;
        } else {
          await like.save();
        }
        await post.save();
        return res.status(200).json(new ApiResponse(200, "Disliked"));
      }
      like.users.push(user._id);
      like.likeCount += 1;
    }

    await like.save();
    post.likes = like._id;
    await post.save();

    res.status(200).json(new ApiResponse(200, "Liked"));
  } catch (error) {
    console.log("Error in liking : ", error);
  }
});
