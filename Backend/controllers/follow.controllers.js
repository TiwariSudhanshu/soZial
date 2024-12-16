import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const follow = asyncHandler(async(req,res)=>{
   try {
     const userId = req.user;
     const {followingId} = req.body
     
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

export const fetchFollowDetails =asyncHandler (async(req,res)=>{
    try {
        const userId = req.user;
        const {profileId} = req.body
        const responseData = {
            followStatus : false,
            followingCount: 0,
            followerCount : 0,
            followings:[],
            followers: []
        }
        const user = await User.findById(userId)
        const profile = await User.findById(profileId)
        
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        if(profile.followers.includes(userIdObjectId)){
            responseData.followStatus= true
        }
        responseData.followingCount= profile.followings.length
        responseData.followings = await User.find(
          { _id: { $in: profile.followings } }, 
          "name username avatar" 
        );
        responseData.followerCount= profile.followers.length
        responseData.followers = await User.find(
          { _id: { $in: profile.followers } },
          "name username avatar" 
        );
        res.status(200).json(
            new ApiResponse(200, responseData, "follow details fetched")
        )

    } catch (error) {
        console.log("Error in fetching follow details : ", error)
        throw new ApiError(400, "Error in fetching follow details")
    }


})

export const unfollow = asyncHandler(async (req, res) => {
    try {
      const userId = req.user; 
      const { followingId } = req.body;
      const user = await User.findById(userId);
      const following = await User.findById(followingId);
  
      if (!user) {
        throw new ApiError(400, "User not found");
      }
      if (!following) {
        throw new ApiError(400, "Following user not found");
      }
  
      if (!user.followings.includes(followingId)) {
        return res.status(400).json(new ApiResponse(400, "Already this user is not followed"));
      }

  
      user.followings = user.followings.filter((id) => String(id) !== String(followingId));


      following.followers = following.followers.filter((id) => String(id) !== String(userId._id));
  
  
      await user.save();
  
      await following.save();
  
      res.status(200).json(new ApiResponse(200, "Unfollowed"));
    } catch (error) {
      console.error("Error in unfollow:", error);
      throw new ApiError(500, "Some error occurred in unfollow");
    }
  });
  