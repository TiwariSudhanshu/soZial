import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Post} from "../models/post.model.js";
import { User } from "../models/user.model.js";

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

    if(!post.likes.includes(user._id)){
      post.likes.push(user)
    }else{
     post.likes = post.likes.filter(id => id.toString() !== user._id.toString())
    }

    await post.save();

    res.status(200).json(new ApiResponse(200, "Liked"));
  } catch (error) {
    console.log("Error in liking : ", error);
    throw new ApiError(500, "Error in liking")
  }
});

// export const likeStatus = asyncHandler(async(req,res)=>{
//   try {
//     const {userId} = req.body;
//     const user = await User.findById(userId).populate({
//       path: "posts",
//       select: '_id likes'
//     })

//     if(!user){
//       throw new ApiError(400, "User not found")
//     }

//     const posts = user.posts

//     res.status(200).json(
//       new ApiResponse(200, posts, "Post fetched")
//     )

//   } catch (error) {
//      console.log("Error in fetching like : ", error);
//     throw new ApiError(500, "Error in fetching like")
//   }
// })

export const postStatus = asyncHandler(async(req,res)=>{
  try {
    const {profileId, userId} = req.body;

    if (!profileId) {
      throw new ApiError(400, "No profile found");
    }

   const responseData = []

   const allPosts = await User.findById(profileId).populate('posts').select('posts').lean();
   const posts = allPosts ? allPosts.posts : [];
   const user = await User.findById(userId);
   posts.forEach((post)=>{
    const isLiked = post.likes?.some((likeId) => String(likeId) === String(userId)) || false; 
    const isBookmarked = user.bookmark?.includes(post._id) || false;
    responseData.push({
      postId: post._id,
      isLiked,
      isBookmarked,
      likeCount: post.likes.length
    });
   })

    res.status(200).json(new ApiResponse(200, responseData, "Fetched posts"));
  } catch (error) {
    console.log("Error in fetching post status : ", error);
    throw new ApiError(500, "Error in fetch post status")
  }
})