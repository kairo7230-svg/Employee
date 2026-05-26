import mongoose from "mongoose";
const connectToDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL)
    }catch(e){
        console.log(e)
    }
}
export default connectToDb;