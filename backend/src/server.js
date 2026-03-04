import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/auth", authRoutes); 

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//testing database
app.use(express.json());
app.post('/users', async(req,res)=>{
  try{
    const{ name, email} = req.body;
    const user = await test.create({ name,email });
  res.status(201).json(user);
  }catch(error){
    res.status(500).json({error: error.message});
  } 
});