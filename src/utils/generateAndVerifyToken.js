/* import  Jwt  from "jsonwebtoken";

export const generateToken=({payload,signature=process.env.JWT_KEY,expireIn=60*30}={})=>{
    const token= Jwt.sign(payload,signature,{expireIn:parseInt(expireIn)})
    return token
}


export const verifyToken=({token,signature=process.env.JWT_KEY}={})=>{
    const decoded= Jwt.verify(token,signature)
    return decoded
} */