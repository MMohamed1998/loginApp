import { postModel } from "../../../databases/models/posts.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppError } from "../../utils/AppError.js";


export const addPost =asyncHandler(async (req, res,next) => {
    const {content}=req.body
    const { userId } = req;
    const userProfile = await userModel.findById(userId);
    if (!userProfile) {
      return next(new Error("please login with valid account"));
    }
    if (!userProfile.isActive || userProfile.isDeleted) {
      return next(new Error("please login first to add post"));
    }
    
    if(req.file){

        const  {public_id,secure_url}= await cloudinary.uploader.upload(req.file.path, {
            // resource_type: `${req.file.fieldname}`,
            folder: `user/${req.userId}/profile/post/media`
          });
          console.log(req.file.fieldname);
          if (req.file.mimetype.startsWith(`${req.file.fieldname}`)){
            const post = await postModel.create({content,media:{secure_url,public_id},createdBy:userId}) ;
            res.status(200).json({ message: "done",post });
          }
        }
          else{
    

     const post = await postModel.create({content,createdBy:userId}) ;
    res.status(200).json({ message: "done",post }); 
  }
})


export const updatePost =asyncHandler(async (req, res,next) => {
  const {post_Id}=req.params
  const { userId } = req;
  const {content} = req.body
  
  const userProfile = await userModel.findById(userId);
  if (!userProfile) {
    return next(new Error("please login with valid account"));
  }
  if (!userProfile.isActive || userProfile.isDeleted) {
    return next(new Error("please login first to update post"));
  }
  
  const foundedPost = await postModel.findById(post_Id);
  if (!foundedPost) {
    return next(new Error("post not found"));
  }
  if(userId!=foundedPost.createdBy){
    return next(new Error("access deny you are not the post owner"));
  }

   if(req.file){

      const  {public_id,secure_url}= await cloudinary.uploader.upload(req.file.path, {
          resource_type: `${req.file.fieldname}`,
          folder: `user/${req.userId}/profile/post/media`
        });
        console.log(req.file.fieldname);
        if (req.file.mimetype.startsWith(`${req.file.fieldname}`)){
          const post = await postModel.findByIdAndUpdate(post_Id,{content,media:{secure_url,public_id},createdBy:userId}) ;
          await cloudinary.uploader.destroy(post.public_id)
          res.status(200).json({ message: "done",post });
        }
      }
        else{
  

   const post = await postModel.findByIdAndUpdate(post_Id,{content}, { new: true }); ;
  res.status(200).json({ message: "done",post }); 
} 
})



   export const profileVideo = asyncHandler(async (req, res, next) => {
    const { userId } = req;
const userProfile = await userModel.findById(userId);
    if(!userProfile) {
      return next (new AppError('user not found ',409))
    }
    const post = await postModel
    .find({ createdBy: userId })
  res.json({ message: "Success", post });

    // Check if there is a video file to upload
     if(!req.file)return next(new AppError("Please upload a file",400))  ;
  
      // Upload video to Cloudinary
      const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path, {
        resource_type: `${req.file.fieldname}`,
        folder: `user/${req.userId}/profile/post/media`
      });
      console.log(post);
      // The video URL on Cloudinary
      const modifiedPost = await postModel.findByIdAndUpdate(_id,{media:{secure_url,public_id}})
      //destroy old img after upload new img
      await cloudinary.uploader.destroy(user.profileImageId)
      return res.json({message:"done",modifiedPost})   
  }); 