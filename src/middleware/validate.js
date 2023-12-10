import Joi from "joi";



export const validate=(validationSchema)=>{
    return(req,res,next)=>{
        let{error}=validationSchema.validate({...req.body,...req.params,...req.query},{abortEarly:false})
        if(!error){
            return next()
        }
        error=error.details.map(elm => elm.message)
        res.status(201).json({message:'error',error})
    }
}