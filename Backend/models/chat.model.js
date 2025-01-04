import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages:[{
        type: mongoose.Types.ObjectId,
        ref: 'messageModel'
    }]
},{timestamps:true})

export const Chat = mongoose.model("Chat", ChatSchema)