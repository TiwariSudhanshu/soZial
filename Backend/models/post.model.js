import { Schema, model } from "mongoose";

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
    // likes:{
    //     type: Schema.Types.ObjectId,
    //     ref: "Likes"
    // }

},{timestamps:true});

export const Post = model('Post', postSchema)