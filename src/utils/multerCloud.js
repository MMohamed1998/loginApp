
import multer,{diskStorage} from "multer";
import { v4 as uuidv4 } from 'uuid';




export const fileValidation={
    image:['image/jpeg','image/jpg','image/png','image/gif','video/mp4'],
    video:['video/mp4','video/3gp','video/flv','video/avi',],
    both:['video/mp4','video/3gp','video/flv','video/avi','image/jpeg','image/jpg','image/png','image/gif','video/mp4']
}
export function fileUpload(customValidation=[]) {
    const storage = diskStorage({})
    const fileFilter=(req,file,cb) => {
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb("in-valid format",false);
        }
    }
    const upload = multer({ storage,fileFilter})
        return upload
}
  