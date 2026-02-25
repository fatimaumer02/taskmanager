import jwt from 'jsonwebtoken';
import User from "../models/userModel.js"

const JWT_SECRET = process.env.JWT_SECRET || "your jwt here";

export default async function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res
        .status(401)
        .json({success: false, message: "Authorization header missing or malformed"});
    }

    const token = authHeader.split(' ')[1];
//Verify  & Attach user object 
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password')

        if(!user){
            return res.status(401).json({success: false, message: "User not found"});
        }
        req.user = user;
        next()
    }
    catch(error){
        console.log("JWT verrified failed" , error)
        return res.status(401).json({success: false, message: "Invalid or expired token"});
    }
}

