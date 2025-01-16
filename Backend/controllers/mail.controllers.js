import nodemailer from "nodemailer";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

let OTP = null;

export const sendOTP = asyncHandler(async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) {
      throw new ApiError("Email is required");
    }

    OTP = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "One Time Password for Sozial",
      html: `Dear user,<br><br>
      We have received a request for an OTP to verify your identity.<br><br>
      Your One Time Password (OTP) is: <h2>${OTP}</h2><br><br>
      Please use this OTP within the next few minutes to complete the verification process. If you did not request this, please ignore this email.<br><br>
      If you have any questions or need further assistance, feel free to contact us.<br><br>
      Best regards,<br>
      Sozial`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json(
        new ApiResponse(200, "Email sent")
    )
  } catch (error) {
    console.log("Error :", error);
    throw new ApiError(500, "Server error in sending Mail");
  }
});

export const verifyOTP = asyncHandler(async(req, res)=>{
    try {
        const {userOTP} = req.body;
        if(!userOTP){
            throw new ApiError(400, "User should type OTP")
        }

        if(userOTP==OTP){
            res.status(200).json(
                new ApiResponse(200, true, "OTP verified")
            )
        }else{
            res.status(200).json(
                new ApiResponse(200, false, "OTP not verified")
            )
        }
    } catch (error) {
        console.log("Error :", error);
        throw new ApiError(500, "Server error in sending Mail");
        
    }
})