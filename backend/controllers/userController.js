import User from "../models/userModel.js";
import validator from "validator";
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your jwt here";
const TOKEN_EXPIRE = '24h'

const createToken = (userId)=>{
    return jwt.sign({
        id:userId,
    },
    JWT_SECRET,
    {
        expiresIn: TOKEN_EXPIRE
    })
}

//Register 
export const registerUser = async (req, res) => {
    const {name , email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    // if (validator.isEmail(email)){
    //     return res.status(400).json({message: "Invalid email"});
    // }
    if (password.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters "});
    }

    try{
        if(await User.findOne({email})){
            return res.status(400).json({message: "User already exists"});
        }
        const hashed = await brcypt.hash(password,10);
        const user = await User.create({name, email, password:hashed})
        const token = createToken(user._id)
        res.status(201).json({success: true,token, user:{id: user._id, name: user.name, email: user.email, }});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}



//LOGIN 

export const loginUser = async (req,res)=>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const match = await brcypt.compare(password, user.password);
        
        if(!match){
            return res.status(400).json({message: "Invalid email or password"});
        }
        const token = createToken(user._id);
        res.status(200).json({success: true, token, user:{id: user._id, name: user.name, email: user.email, }});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
}


//Get user 

export const getUser = async (req,res)=>{
    try{
      const user=  await User.findById(req.user.id).select('name email');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({success: true, user});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
}


//Update User

export const updateUser = async (req,res)=>{
        const {name, email} = req.body;

        if(!name||!email || !validator.isEmail(email)){
            return res.status(400).json({message: "Invalid details"});  
        }
        try{
           const exist = await User.findOne({email , _id: {$ne: req.user.id}});
           if(exist){
            return res.status(400).json({message: "Email already in use"});
        }  
        await User.findByIdAndUpdate(
            req.user.id,
            {name, email},
            {new: true, runValidators: true, select: 'name email'}
        ) ;
        res.status(200).json({success: true, user: req.user});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message});
    }
}


//change password
export const updatePassword = async (req,res)=>{

    const {currentPassword, newPassword} = req.body;
    if(!currentPassword ||!newPassword || newPassword.length <8){
        return res.status(400).json({sucess: false, message: "Invalid details"});
    }

try{
const user = await User.findById(req.user.id).select("password")

if(!user){
    return res.status(400).json({success: false, message: "User not found"});   
}
const match = await brcypt.compare(currentPassword, user.password);


if(!match){
    return res.status(400).json({success: false, message: "Current password is incorrect"});
}

user.password = await brcypt.hash(newPassword,10)
await user.save();
res.json({success: true, message: "Password changed successfully"});
}
catch(err){
    console.log(err)
res.status(500).json({message: err.message});
}
}
