import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authLogger, errorLogger } from "../utils/logger.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    authLogger.info(`Signup attempt: ${normalizedEmail}`);

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      authLogger.warn(`Signup failed: user exists (${normalizedEmail})`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    authLogger.info(`User Created: ${user._id}`);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();

    res.json({ token, user: userData });
  } catch (error) {
    errorLogger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const normalizedEmail = email.toLowerCase();

    authLogger.info(`Login Attempt: ${normalizedEmail}`);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      authLogger.warn(`Login failed (${normalizedEmail})`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      authLogger.warn(`Login failed (${normalizedEmail})`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    authLogger.info(`Login Successful: ${user._id}`);

    const { password: _, ...userData } = user.toObject();

    res.json({ token, user: userData });
  } catch (error) {
    errorLogger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const normalizedEmail = email.toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
    if(existingUser) {
      return res.status(400).json({ message: "Email already taken by someone else" });
    }

    const user = await User.findByIdAndUpdate(userId, { name, email: normalizedEmail }, { new: true });
    
    if(!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userData } = user.toObject();
    res.json({ user: userData, message: "Profile updated successfully" });

  } catch (error) {
    errorLogger.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    errorLogger.error(error);
    res.status(500).json({ message: "Server error changing password" });
  }
};