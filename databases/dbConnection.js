import mongoose from "mongoose";



export function dbConnection(){
    mongoose.connect('mongodb+srv://masoudy1998:Masoudy_1998@cluster0.pfjrs98.mongodb.net/loginapp').then(()=>{
        console.log("database Connected");
    }).catch((err)=>{
        console.log("database Error: ", err );
    })
}