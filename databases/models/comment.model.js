import { Schema,model } from "mongoose";


const commentSchema = new Schema ({
    commentBody:{
        type: "String",
        required: true,
        trim: true,
    },
    createdBy:{
        type:Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    postId:{
        type:Schema.ObjectId,
        ref: 'post',
        required: true,
    },
    replies:[{
        type:Schema.ObjectId,
        ref: 'commentReplay',
        default: []
      }],
      likes:[{
        type:Schema.ObjectId,
        ref: 'user',
        default: []
      }],
},{timestamps: true})

export const commentModel=model('comment', commentSchema)