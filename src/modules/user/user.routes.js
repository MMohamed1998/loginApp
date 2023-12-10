import  Express  from "express";
import * as user from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multerCloud.js";



const userRouter=Express.Router()

userRouter .post('/signUp',user.signUp)
userRouter.get('/verify/:id',user.verify);    
userRouter .post('/signIn',user.signIn)
userRouter.get('/userProfile',auth,user.userProfile);    
userRouter.put('/updateProfile',auth,user.updateProfile);    
userRouter.patch("/coverPic",
fileUpload(fileValidation.image).array('images'),auth,user.coverPic)
userRouter.patch("/profilePic",
fileUpload(fileValidation.image).single('image'),auth,user.profilePic)
userRouter.patch('/changePassword',auth,user.changePassword);    
userRouter.put('/softDeleteUser',auth,user.softDeleteUser);    
userRouter.post('/forgetPassword',user.forgetPassword);    
userRouter.post('/resetPassword',auth,user.resetPassword);    



export default userRouter