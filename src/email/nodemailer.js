import nodemailer from "nodemailer"
import { htmlCode } from "./verifyHtml.js";
import jwt from "jsonwebtoken"
export const sendEmail=async(options)=>{
  let decoded=await jwt.verify(options.TOKEN,process.env.JWT_KEY)
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`
        }
      });
      const info = await transporter.sendMail({
        from:`"mohamed masoud" <${process.env.EMAIL}>`, // sender address
        to: decoded.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: htmlCode(`http://localhost:3000/user/verify/${decoded.id}`), // html body
      });
      console.log("Message sent: %s", info);

}

export const resetCode=async(email,code)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.PASSWORD}`
        }
      });
      const info = await transporter.sendMail({
        from:`"mohamed masoud" <${process.env.EMAIL}>`, // sender address
        to:email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `Your reset code is: ${code}`
      });
      console.log("Message sent: %s", info);

}
