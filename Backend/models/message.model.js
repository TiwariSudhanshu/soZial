import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
    to:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    timeStamp:{
        type: Date,
        default: Date.now()
    }
})

export const messageModel = mongoose.model("messageModel", MessageSchema)