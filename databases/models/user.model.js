import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";

const userSchema = new Schema ({
    firstName:{
        type: "string",
        required: true,
        trim: true,
    },
    lastName:{
        type: "string",
        required: true,
        trim: true,
    },
    email:{
        type: "string",
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type: "string",
        required: true,
    },
    ResetCode:{},
    resetCodeExpiration:{
        type:"Date",
        default:Date.now
    },
    phone:{
        type:"string",
        unique: true,
        require:true,

    },
    age:{
        type:"number",
        require:true,
    },
    profileImage:{
        type : "String" ,
        
    },
    profileImageId:{
        type :"String"
    },
    coverImages:[],
    role:{
        type:"String" ,
        enum:['admin','user'],
        default:'user',
    },
    isActive:{
        type:"Boolean",
        default :false
    },
    Verified:{
        type :"boolean",
        default:false
    },
    isDeleted:{
        type:"Boolean",
        default : false
    }
    
},{timestamps: true})


userSchema.pre('save',function(){
    this.password = bcrypt.hashSync(this.password,8) 
})
 userSchema.pre('save',function(){
    this.phone = CryptoJS.AES.encrypt(this.phone, process.env.CRYPTO_KEY).toString();
}) 
/*
userSchema.pre('findByIdAndUpdate',function(){
    this.phone = CryptoJS.AES.encrypt(this.phone, process.env.CRYPTO_KEY).toString();
})  */

export const userModel=model('user', userSchema)