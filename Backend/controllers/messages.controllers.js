import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { messageModel } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";

export const createMessage = asyncHandler(async (req, res) => {
    try {
      const { to, from, message } = req.body;
  
      let chat = await Chat.findOne({
        $or: [
          { $and: [{ user1: to }, { user2: from }] },
          { $and: [{ user2: to }, { user1: from }] },
        ],
      });
  
      if (!chat) {
        chat = await Chat.create({
          user1: from,
          user2: to,
          messages: [], 
        });
      }
  
      const messageInstance = await messageModel.create({
        from,
        to,
        content: message,
      });
  
      chat.messages.push(messageInstance);
  
      await chat.save();
  
      res.status(200).json(
        new ApiResponse(200, "Created chat/saved message")
      );
    } catch (error) {
      console.error("Error in creating chat or saving message:", error);
      throw new ApiError(500, "Server error while creating chat or saving message");
    }
  });
  

export const getChat = asyncHandler(async(req,res)=>{
    try {
        const {to, from} = req.body;
        if (!to || !from) {
            throw new ApiError(400, "Both 'to' and 'from' fields are required.");
          }
        const chat = await Chat.findOne({
            $or: [
                {
                    $and:[{user1:to},{user2:from}]
                },
                {
                    $and:[{user2:to},{user1:from}]
                }
            ]
        }).populate('messages')
        console.log(chat)
        if (!chat) {
            return res.status(200).json(new ApiResponse(200, null, "Chat not found"));
          }

        res.status(200).json(
            new ApiResponse(200, chat, "Chat fetched")
        )

    } catch (error) {
        console.log("Error in getting chat  :", error)
        throw new ApiError(500, "Server error while getting chat ")
    }
})