import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import User from './models/Users.js';
import connectToDb from "./db/db.js";

const userRegister=async()=>{
    try{
        await connectToDb();
        const hashPassword = await bcrypt.hash('akshat',10);
        const newUser = new User({
            name: "akshat",
            email: 'akshat@gmail.com',
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
    }catch(e){
        console.log(e)
    }finally{
         await mongoose.disconnect();
    }
}

userRegister();