import { Schema, model } from "mongoose";
import mongoose from "mongoose";
const postSchema = Schema({
    content:{
        type: String
    },
    image:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    likes:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }]

},{timestamps:true});

export const Post = model('Post', postSchema)