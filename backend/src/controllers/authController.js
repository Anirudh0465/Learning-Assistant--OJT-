import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authLogger,errorLogger  } from "../utils/logger.js";

export const signup = async(req,res)=>{
    try{
    const{name,email,password} = req.body;

    authLogger.info(`Signup attempt: ${email}`);

    const userExists = await User.findOne({email});
    if(userExists){
        authLogger.warn(`Signup failed: user exists (${email})`);
        return res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    authLogger.info(`User Created: ${user._id}`);

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET 
    );
    res.json({token,user});
    }catch (error){
        errorLogger.error(`Signup error: ${error.message}`)
        res.status(500).json({ message: "Server error" });
    }
};


export const login = async(req,res) => {
    try{
    const{email,password} = req.body;

    authLogger.info(`Login Attempt: ${email}`);

    const user = await User.findOne({email});
    if(!user){
        authLogger.warn(`Login failed: user not found (${email})`)
        return res.status(404).json({message: 'User not found'});
    }
    const match = await bcrypt.compare(password, user.password);

    if(!match){
        authLogger.warn(`Login failed: wrong password (${email})`)
        return res.status(400).json({message: "Wrong Password"});
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET
    );

    authLogger.info(`Login Sucessful: ${user._id}`);

    res.json({token,user})
    }catch(error){
        errorLogger.error(`Login error: ${error.message}`);
         res.status(500).json({ message: "Server error" });
    }
};