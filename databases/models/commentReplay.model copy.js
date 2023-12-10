import { Schema,model } from "mongoose";


const commentReplaySchema = new Schema ({
    commentReplayBody:{
        type: "String",
        required: true,
        trim: true,
    },
    createdBy:{
        type:Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    commentId:[{
        type:Schema.ObjectId,
        ref: 'comment',
        default: []
      }],
      likes:[{
        type:Schema.ObjectId,
        ref: 'user',
        default: []
      }],
},{timestamps: true})

export const commentReplayModel=model('commentReplay', commentReplaySchema)