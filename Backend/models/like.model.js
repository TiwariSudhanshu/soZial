import { Schema, model} from "mongoose";

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

export const Likes = model( 'Likes',likeSchema)