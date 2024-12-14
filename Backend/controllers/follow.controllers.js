import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


export const follow = asyncHandler(async(req,res)=>{
   try {
     const userId = req.user;
     const {followingId} = req.body
     
     console.log("UserId", userId)
     console.log("FollowingId", followingId)
     const user = await User.findById(userId)
     const following = await User.findById(followingId)
 
     if(!user){
         throw new ApiError(400, "User not found");
     }
     if(!following){
         throw new ApiError(400, "Following user not found");
     }
     
     if (user.followings.includes(followingId)) {
        return res.status(400).json(new ApiResponse(400, "Already following this user"));
      }
     const followed = user.followings.push(followingId)
     const follower = following.followers.push(userId)
 
     console.log(followed)
     console.log(follower)

     await user.save();
     await following.save();
 
     res.status(200).json(
         new ApiResponse(200, "Followed")
     )
 
   } catch (error) {
    console.log("Error :", error)
        throw new ApiError(500, "Some error occured in follow" )
   }
})