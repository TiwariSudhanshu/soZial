import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";


export const fetchUser = asyncHandler(async(req,res)=>{
    
   try {
     const user = req.user;
 
     if(!user){
         throw new   ApiError(400,'User not found')
     }

     res.status(200).json(
         new ApiResponse(200, user, "User found")
     )
   } catch (error) {
        console.log("Error", error)
   }    

})


export const changeInfo = asyncHandler(async (req, res) => {
  const { name, bio, email, mobileNo, username } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    // Handle Avatar
    const avatarPath =
      req.files && req.files.avatar && req.files.avatar[0]
        ? req.files.avatar[0].path
        : undefined;

    const avatar = avatarPath ? await uploadOnCloudinary(avatarPath) : null;

    // Handle Cover Image
    const coverImagePath =
      req.files && req.files.coverImage && req.files.coverImage[0]
        ? req.files.coverImage[0].path
        : undefined;

    const coverImage = coverImagePath ? await uploadOnCloudinary(coverImagePath) : null;

    // Saving data
    user.name = name;
    user.bio = bio;
    user.email = email;
    user.mobileNo = mobileNo;
    user.username = username;

    // Only update avatar and cover image if they exist
    if (avatar) {
      user.avatar = avatar.secure_url;
    }

    if (coverImage) {
      user.coverImage = coverImage.secure_url;
    }

    await user.save();

    const newUserData = await User.findById(user._id).select(
      "-password -refreshToken" )
      .populate("posts");
      
    res.status(200).json(new ApiResponse(200, newUserData, 'User Info edited'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Error');
  }
});

export const changePassword = asyncHandler( async(req, res)=>{
  try {
    const { oldPass, newPass, confirmPass} = req.body;
    if (!oldPass || !newPass || !confirmPass) {
      return res.status(400).json({ message: "All fields are required" });
  }
  
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    console.log(user)
    const isPasswordValid = await user.isPasswordCorrect(oldPass);
  
    if(!isPasswordValid){
      throw new ApiError(400, "Old Password incorrect")
    }

  
    if(newPass != confirmPass){
      throw new ApiError(400, "Confirm password does not matches the new password")
    }
  
    user.password = newPass;
    await user.save();
  
    res.status(200).json(
      new ApiResponse(200, "Password Changed")
    )
  } catch (error) {
    console.log("Error in changing password ", error)
  }

})