import jwt from "jsonwebtoken";

export const protect = (req,res,next) => {
    console.log('Auth header:', req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "No token"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error('Token verify error:', err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};