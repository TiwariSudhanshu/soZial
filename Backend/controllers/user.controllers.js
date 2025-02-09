import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    try {
      await user.save({validateBeforeSave: false});
    } catch (error) {
      console.log("Failed saving", error);
    }
    return {accessToken, refreshToken};
  } catch (error) {
    console.log("Error during generation :", error);
    throw new ApiError(500, "Failed to generate Tokens");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    age,
    gender,
    email,
    mobileNo,
    dob,
    password,
    address,
    bio,
    fb,
    ig,
    lkin,
    posts,
  } = req.body;

  // Validate required fields
  if (
    [email, mobileNo, password].some((field) => !field || field.trim() === "")
  ) {
    throw new ApiError(400, "Some fields are missing");
  }

  // Check if user with the same username, email, or mobile number already exists
  const existedUser = await User.findOne({
    $or: [{username}, {email}],
  });
                  
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // Handle avatar upload
  const avatarPath =
    req.files && req.files.avatar && req.files.avatar[0]
      ? req.files.avatar[0].path
      : undefined;

  if (!avatarPath) {
    throw new ApiError(404, "Profile photo not found");
  }

  const avatar = await uploadOnCloudinary(avatarPath);

  if (!avatar) {
    throw new ApiError(500, "Profile photo not uploaded due to server error");
  }

  // Create new user
  const user = await User.create({
    name,
    username,
    mobileNo,
    email,
    avatar: avatar.secure_url,
    age,
    gender,
    dob,
    bio,
    address,
    password,
    fb,
    posts,
    ig,
    lkin,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken").populate("posts");

  if (!createdUser) {
    throw new ApiError(500, "Internal server error in saving data");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User successfully created", createdUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const {username, email, password} = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{username}, {email}],
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(
    user._id
  );

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "No tokens are created");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken" )
    .populate("posts"); 

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {loggedInUser, accessToken, refreshToken},
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
      new: true,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User loggedout Successfully"));
});
