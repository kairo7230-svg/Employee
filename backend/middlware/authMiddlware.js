import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const verifyUser = async(req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({success:false, error:"token not provided"})
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY || "fallback_secret_key");
    if(!decoded){
      return res.status(401).json({success:false, error:"invalid token"})
    }

    const user = await User.findById(decoded._id).select("-password");
    if(!user){
      return res.status(401).json({success:false, error:"user not found"})
    }

    req.user = user;
    next();
  } catch(error) {
    return res.status(401).json({success:false, error:"token verification failed"})
  }
}

export default verifyUser;