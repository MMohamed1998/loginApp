import { AppError } from "./AppError.js";

export const asyncHandler=(fn)=>{
    return (req, res, next) => {
        return fn(req, res, next).catch(error=>{
            return next (new Error(error));
        });
    }
}

export const globalErrorHandling=(err ,req , res , next) => {
    let error = err.message 
    let code = err.statusCode ||500
    process.env.MODE =="development"?
    res.status(code).json({error,stack:err.stack}):res.status(code).json({error})
}