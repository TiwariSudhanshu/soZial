import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";


export const bookmark = asyncHandler(async(req, res)=>{
  try {
    const user = await User.findById(req.user);
    const {postId} = req.body
  
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    if (!postId) {
      throw new ApiError(400, "Post ID is required");
    }

  
    if(!user.bookmark.includes(postId)){
      user.bookmark.push(postId)
  
      await user.save();
    
      res.status(200).json(
        new ApiResponse(200, "Bookmarked")
      )
    }else{
     user.bookmark = user.bookmark.filter((id)=> id != postId)
    
      await user.save();
    
      res.status(200).json(
        new ApiResponse(200, "UnBookmarked")
      )
    }
   
  } catch (error) {
    console.log("Error in bookmarking", error)
    throw new ApiError(500, "Server error in bookmarking")
  }
})


export const getAllBookMark = asyncHandler(async(req,res)=>{
 try {
  const userId = req.user
  const user = await User.findById(userId)
   if(!user){
     throw new ApiError(400, "No user found");
   }
 
 
   const postIds = user.bookmark;
 

   const bookmarks = await Promise.all(
    postIds.map(async (id) => {
      const post = await Post.findById(id);
      if (!post) {
        throw new ApiError(400, "Post not found");
      }

      const profile = await User.findOne({ posts: id });
      if (!profile) {
        throw new ApiError(400, "Profile not found");
      }

      return {
        name: profile.name,
        username: profile.username,
        avatar: profile.avatar,
        id: post._id,
        content: post.content,
        image: post.image,
        date: post.date,
        likes: post.likes,
      };
    })
  );

 
 res.status(200).json(
   new ApiResponse(200, bookmarks, "Bookmarks fetched")
 )
 
 } catch (error) {
  console.log("Error in fetching bookmarks", error)
  throw new ApiError(500, "Server error while fetching bookmarks")
 }

})