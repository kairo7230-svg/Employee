import mongoose from "mongoose";

const connectToDb= async()=>{
    try{
        await mongoose.connect()
    }catch(error){
        console.log(error);
    }
}