import User from './models/Users.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectToDb from './db/db.js'; // Import the function

const userRegister = async () => {
    try {
        // 1. MUST wait for the connection before doing anything else
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
        // 2. Close the connection so the script finishes and exits the terminal
        await mongoose.disconnect();
    }
}

userRegister();