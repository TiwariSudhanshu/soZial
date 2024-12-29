import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const findUserById = asyncHandler(async(req, res)=>{

    try {
        const {id} = req.body;
    
        const profile = await User.findById(id).populate("posts");
    
        
        if (!profile) {
            return res.status(404).json(
              new ApiResponse(404, null, 'Profile not found')
            );
          }
        res.status(200).json(
            new ApiResponse(200, profile, 'Profile send successfully')
        )
    } catch (error) {
        console.log("Error from backend :", error);
        return res.status(500).json(
            new ApiResponse(500, null, 'An error occurred while fetching the profile')
          );
    }

})

export const findUserByUsername = asyncHandler(async(req,res)=>{
  try {
    if(req.body.username === '' || req.body === null){
     return res.status(200).json(new ApiResponse, null, "Serach cleared" )
    }
    const {username} = req.body;
  
    const user = await User.findOne({username:username}).populate("posts")
  
    if(!user){
      throw new ApiError(400, "User not found");
    }
  
    return res.status(200).json(
      new ApiResponse(200, user, "Searched the user")
    )
  
  } catch (error) {
    console.log("Error in searching : ", error)
  }
})