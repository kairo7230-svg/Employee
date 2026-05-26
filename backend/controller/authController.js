import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import bcrypt from 'bcryptjs'; // or 'bcryptjs' — match your package.json

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

export { login };