import { userModel } from "../../../databases/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js";
import randomstring from "randomstring";
import { resetCode, sendEmail } from "../../email/nodemailer.js";
import cloudinary from "../../utils/cloudinary.js";


//sign up endpoint .....................
const signUp=asyncHandler(async (req, res, next) => {
    //find user py email....................
    let isUser= await userModel.findOne({email:req.body.email})
    if(isUser) return next (new AppError('account already exist',409))
    //add new user..............................
    const user = new userModel(req.body);
    await user.save();
    //generate token to send email.................
    let TOKEN = jwt.sign({email:user.email,id:user._id,role:user.role},process.env.JWT_KEY)
    sendEmail({TOKEN})
    res.status(201).json({ message: "registered successfully please confirm your account" });
});

// verify end point ..............
export const verify = async(req,res,next)=>{
    // id from send email function 
    const {id}=req.params
    const verifyUser = await userModel.findByIdAndUpdate(id,{Verified:true,isDeleted:false})
      if(!verifyUser){
        return next (new AppError('invalid id',400))
      }else{
        res.status(201).json({message:"verified"})
      }
}; 

// sign in endpoint....................
const signIn=asyncHandler(async (req, res, next) => {
    const{email,password}=req.body
    //find user py email.................... 
    let isUser= await userModel.findOne({email})
    // check if there is a user and passwords are matches
    if(!isUser || !bcrypt.compareSync(password, isUser.password))
        return next (new AppError('incorrect email or password',409))
    //generate token to send email 
    let TOKEN = jwt.sign({email:isUser.email,id:isUser._id,role:isUser.role},process.env.JWT_KEY)
    // check if user verify his account and his account is not deleted 
    if(!isUser.Verified||isUser.isDeleted) {
      sendEmail({TOKEN})
     return next (new AppError('you account is not verified or it was deleted we sent you a verification link to your account please verify your account',409))
    }   
    //login and update user activation
    res.status(201).json({ message: "login successfully",TOKEN});
    return userModel.findOneAndUpdate(
       {email} ,
      { isActive: true, isDeleted: false }
    );
    
});

  // get user profile
const userProfile = asyncHandler(async (req, res, next) => {
    const { userId } = req;
    // find user by id taken from token
    const userProfile = await userModel.findById(userId,{password:0,_id:0});
    // check if user or not 
    if(!userProfile) {
      return next (new AppError('user not found ',409))
    }
    //check if user offline or account is deleted
    if (!userProfile.isActive || userProfile.isDeleted) {
      return next(new AppError( "please login first to view profile",409) );
    } 
    //decrypt phone number
    if(userProfile.phone)userProfile.phone = CryptoJS.AES.decrypt(userProfile.phone, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
    // print user profile after checking
    res.status(200).json({ message: `welcome ${userProfile.firstName} ${userProfile.lastName}`,userProfile});

  });

// update user profile
  const updateProfile=asyncHandler(async (req, res, next) => {
    const { userId } = req;
    let{firstName,lastName,email,phone,age}=req.body
    //find user by id taken from token
    const userProfile = await userModel.findById(userId);
    if(!userProfile) {
      return next (new AppError('user not found ',409))
    }
    // check if user is online or his account was deleted
    if (!userProfile.isActive || userProfile.isDeleted) {
      return next(new AppError( "please login first to update profile",409) );
    } 
    // compare user email with database email  to send confrmition email
    if(userProfile.email!=email ){
      await userModel.findByIdAndUpdate(userId ,{isActive:false,Verified: false });}
    //encrypt phone if user change phone 
    if(phone)phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTO_KEY).toString();
    // if he pass all above the data will be updated
  const updatedUser = await userModel.findByIdAndUpdate(userId,{firstName,lastName,email,phone,age}, { new: true });
  
    res.status(200).json({ message: 'updated successfully you need to verify your account and login again ',updatedUser});

  });

// upload profile picture
export const profilePic=asyncHandler(async(req,res,next)=>{
  const { userId } = req;
const userProfile = await userModel.findById(userId);
    if(!userProfile) {
      return next (new AppError('user not found ',409))
    }
  //check if there is a file to upload
  if(!req.file)return next(new AppError("Please upload a file",400))  ;
  // take id and url from cloudinary to store it in database
  const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder: `user/${req.userId}/profile`})
  //find user to store img in it
  const user = await userModel.findByIdAndUpdate(req.userId,{profileImage:secure_url,profileImageId:public_id})
  //destroy old img after upload new img
  await cloudinary.uploader.destroy(user.profileImageId)
  return res.json({message:"done",})

})


// set cover pic
export const coverPic=asyncHandler(async(req,res,next)=>{
  const { userId } = req;
const userProfile = await userModel.findById(userId);
    if(!userProfile) {
      return next (new AppError('user not found ',409))
    }
  //check if there is a file to upload
  if(!req.files.length)return next(new AppError("Please upload a file",400))  ;
   // loop on the cloudinary img array to get img url and id and push it in empty array
  const coverImages = []
  for(const file of req.files){
    const {public_id,secure_url}= await cloudinary.uploader.upload(file.path,{folder: `user/${req.userId}/profile/cover`})
    coverImages.push({public_id,secure_url})
  }
  //take array of ids and urls from cloudinary to store it in database
  const user = await userModel.findByIdAndUpdate(req.userId,{coverImages},{new:true})
  return res.json({message:"done",user})

})

//change password endpoint
const changePassword=asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const { oldPassword, newPassword, renewPassword } = req.body;
  //find user by id taken from token
  const userProfile = await userModel.findById(userId);
  if(!userProfile) {
    return next (new AppError('user not found ',409))
  }
  // check if user is online or his account was deleted
  if (!userProfile.isActive || userProfile.isDeleted) {
    return next(new AppError( "please login first to change password",409) );
  } 
  // compare user email and password with database email and password to send confrmition email
  const passwordMatch = bcrypt.compareSync(oldPassword, userProfile.password)
  if(!passwordMatch){
    return next(new AppError( "invalid old password",409) );
  }
  //check if new pass match renew pass
  if (newPassword !== renewPassword) {
    return next(new AppError( "New password and confirm password do not match",409) );
  }
  // check if old pass match new pass
  if (newPassword == oldPassword) {
    return next(new AppError( "Please type a new password that is not similar to the old one",409) );
  }
  // ask user to signin again
    await userModel.findByIdAndUpdate(userId ,{isActive:false });
  // if he pass all above the data will be updated
  userProfile.password=newPassword
  await userProfile.save()
  res.status(200).json({ message: 'updated successfully you need to  login again '});

});

//soft delete user
const softDeleteUser =asyncHandler(async (req, res,next) => {
  const { userId } = req;
  // find user by id taken form token
  const userProfile = await userModel.findById(userId);
  //check if user found or not
  if (!userProfile) {
    return next(new AppError( "User not found",409) );
  }
  //check if user offline or account is deleted
  if (!userProfile.isActive || userProfile.isDeleted) {
    return next(new AppError( "please login first to deleted account",409) );
  }
  // update status of user to delete it
  await userModel.findByIdAndUpdate(userId ,{isDeleted: true, isActive: false,Verified:false});
  res.json({ message: "user soft deleted successfully" });
}) ;

// forget password endpoint
const forgetPassword =asyncHandler(async (req, res,next) => {
  // take email from user
  const {email}=req.body;
  // function to generate reset code
  function generateResetCode() {
    return randomstring.generate({
      length: 6,
      charset: 'numeric'
    });
  }
  const code =generateResetCode();
  // make code valid for 2 min
  const TWO_MINUTES = 2 * 60 * 1000;
  const expCode=new Date(Date.now()+TWO_MINUTES)
  //find user by email to send reset code
  const userProfile = await userModel.findOne({ email })
  if(userProfile)
  // if user  send him reset code by email
  resetCode(email,code);
  // encrypt reset code
  const encryptCode=CryptoJS.AES.encrypt(code, process.env.CRYPTO_KEY).toString()
  // save reset code and exp time in database
  await userModel.updateMany({ResetCode:encryptCode,resetCodeExpiration:expCode})
  //generate token of user date and valid for 2min
  let TOKEN = jwt.sign({email:userProfile.email,id:userProfile._id},process.env.JWT_KEY,{expiresIn:60*2}) 
  res.status(200).json({ message: "reset code sent to your email ",TOKEN})

}) ;

// reset password endpoint
const resetPassword =asyncHandler(async (req, res,next) => {
  const { userId } = req;
  const { resetCode, newPassword}=req.body;
  // find user by id from token
  const userProfile = await userModel.findById(userId);
  if(!userProfile){
    return next(new AppError( "user not found ",409) );
  }
  // check if new password like old password
  const passwordMatch = bcrypt.compareSync(newPassword, userProfile.password)
  if(passwordMatch){
    return next(new AppError("New password can't be same as old one!",503))
  }
  // convert time to milliseconds
  const milliseconds = Date.parse(userProfile.resetCodeExpiration);
  // compare reset code with reset code that generated from forget password endpoint and expiring time pass 2 min
  if(resetCode==CryptoJS.AES.decrypt(userProfile.ResetCode,process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8) && milliseconds>=Date.now()) {
    // save new password and empty reset code and time 
    userProfile.password = newPassword;
    userProfile.ResetCode = "";
    userProfile.resetCodeExpiration ="";
    await userProfile.save()
    res.status(200).json({ message: "password changed successfully "})
  }
  
  return next(new AppError( "invalid reset Code or it is expired",409) );

}) ;

export const allowedTo = (...roles)=>{
    return asyncHandler(async (req, res, next) => {
        if(!roles.includes(req.user.role))
        return next(new AppError('you are not authorized to access this route. you are' + req.user.role,401))
        next()
    })
  }


export {
    signUp,
    signIn,
    userProfile,
    updateProfile,
    changePassword,
    softDeleteUser,
    forgetPassword,
    resetPassword
}