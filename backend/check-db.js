import mongoose from 'mongoose';
import User from './src/models/User.js';

mongoose.connect("mongodb://anirudh0465:8s1eWaxIea9MkK3q@ac-8uiode8-shard-00-00.zhgi6lk.mongodb.net:27017,ac-8uiode8-shard-00-01.zhgi6lk.mongodb.net:27017,ac-8uiode8-shard-00-02.zhgi6lk.mongodb.net:27017/learningapp?ssl=true&replicaSet=atlas-4vphpk-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(async () => {
    const user = await User.findOne({ email: "ayush.9454846458@gmail.com" });
    if (user) {
      console.log("User found:", user.email);
    } else {
      console.log("User NOT found.");
    }
    const allUsers = await User.find({}, 'email name');
    console.log("All users in DB:", allUsers);
    mongoose.disconnect();
  });
