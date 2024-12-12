import { Schema, Model } from "mongoose";
import { User } from "./user.model";

const likeSchema = Schema({
    likeCount:{
        type: Number,
        default: 0
    },
    users:[{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
});

export const Likes = Model( Likes,"likeSchema")