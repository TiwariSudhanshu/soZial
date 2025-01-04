import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import cookie from "cookie"; 

export const authenticate = (socket, next) => {
  // Get cookies from the socket handshake headers
  const cookies = socket.handshake.headers.cookie;

  // Parse cookies (use 'cookie' to parse cookies)
  const parsedCookies = cookie.parse(cookies || '');  // Safely parse cookies

  // Fetch access and refresh tokens from cookies
  const accessToken = parsedCookies.accessToken;
  const refreshToken = parsedCookies.refreshToken;

  if (!accessToken) {
    return next(new ApiError(401, 'No access token provided, authentication failed.'));
  }

  let decodedToken;
  try {
    // Verify the access token
    decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // If access token verification fails, try using the refresh token to get a new access token
    if (!refreshToken) {
      return next(new ApiError(401, 'No valid tokens found, authentication failed.'));
    }

    try {
      // Verify refresh token and generate a new access token if valid
      const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Optionally, you can issue a new access token here
      const newAccessToken = jwt.sign(
        { _id: refreshDecoded._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }  // You can change the expiration time as needed
      );

      decodedToken = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET); // Verify new access token
    } catch (refreshError) {
      return next(new ApiError(401, `Token verification failed: ${refreshError.message}`));
    }
  }

  // Find the user by the decoded token ID
  User.findById(decodedToken._id).select("-password -refreshToken")
    .then(user => {
      if (!user) {
        return next(new ApiError(401, 'User not found.'));
      }

      // Assign the user's ID as the socket ID
      socket.id = user._id.toString(); // Set socket ID to user ID

      // Attach the user object to the socket for further use
      socket.user = user;

      // Proceed with the connection
      next();
    })
    .catch(err => {
      return next(new ApiError(500, 'Database error: ' + err.message));
    });
};
