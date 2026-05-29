// import 'dotenv/config'; // ← ADD THIS FIRST
import User from './models/Users.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectToDb from './db/db.js';

const userRegister = async () => {
    try {
        await connectToDb(); 

        const hasPassword = await bcrypt.hash("admin", 10);
        
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hasPassword,
            role: "admin"
        });

        await newUser.save();
        console.log("✅ Admin user created successfully!");

    } catch (error) {
        console.log("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

userRegister();