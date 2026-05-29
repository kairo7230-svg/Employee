import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import bcrypt from 'bcryptjs'; // or 'bcryptjs' — match your package.json

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, error: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        console.error("Signup controller error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY || "fallback_secret_key",
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error("Login controller runtime error:", error.message); // add .message
    console.error("Full error:", error); // add this line
    return res.status(500).json({ success: false, error: error.message })
    }
};
const verify = async (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
}
export { signup, login ,verify};