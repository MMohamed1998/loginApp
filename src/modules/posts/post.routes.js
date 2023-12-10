import  Express  from "express";
import * as post from "./post.controller.js";
import { auth } from "../../middleware/auth.js";

import { allowedTo } from "../user/user.controller.js";
import { fileUpload, fileValidation } from "../../utils/multerCloud.js";



const postRouter=Express.Router()



postRouter.post('/img',auth,fileUpload(fileValidation.image).single('image'),post.addPost)
postRouter.post('/vid',auth,fileUpload(fileValidation.video).single('video'),post.addPost)
postRouter.route("/")
.patch(fileUpload(fileValidation.video).single('video'),auth,post.profileVideo)
postRouter.get('/updatePost/:post_Id',auth,fileUpload(fileValidation.image).single('image'),post.updatePost)




/* userRouter.get('/verify/:id',user.verify);    
userRouter .post('/signIn',user.signIn)
userRouter.get('/userProfile',auth,user.userProfile);    
userRouter.put('/updateProfile',auth,user.updateProfile);    
userRouter.patch("/profilePic",
fileUpload(fileValidation.image).single('image'),auth,user.profilePic)
userRouter.patch("/coverPic",
fileUpload(fileValidation.image).array('images'),auth,user.coverPic)
userRouter.patch('/changePassword',auth,user.changePassword);    
userRouter.put('/softDeleteUser',auth,user.softDeleteUser);    
userRouter.post('/forgetPassword',user.forgetPassword);    
userRouter.post('/resetPassword',auth,user.resetPassword);    
 */


export default postRouter