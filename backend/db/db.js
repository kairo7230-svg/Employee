import mongoose from "mongoose";
const connectToDb= async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
    }catch(e){
        console.log(e)
    }
}
export default connectToDb;