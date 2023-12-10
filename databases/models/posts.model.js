import { Schema,model } from "mongoose";


const postSchema = new Schema ({
    content:{
        type: "String",
        required: true,
        trim: true,
    },
    media:[],
    likes:[{
        type:Schema.ObjectId,
        ref: 'user',
        default: []
      }],
      createdBy:{
        type:Schema.ObjectId,
        ref: 'user',
        required: true,
      },
      comments:[{
        type:Schema.ObjectId,
        ref: 'comment',
        default: []
      }],
      privacy:{
        type:"String" ,
        enum:['me','public'],
        default:'public',
    },
},{timestamps: true})

export const postModel=model('post', postSchema)