import User from './models/Users';
import bcrypt from 'bcrypt';
const userRegister= async()=>{
    try{
        const hasPassword = await bcrypt.hash("admin",10);
        const newUser= new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hasPassword,
            role: "admin"
        });
        await newUser.save();
    }catch(error){
        console.log(error);
    }
}

userRegister();