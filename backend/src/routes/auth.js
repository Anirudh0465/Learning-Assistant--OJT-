import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Verify password to log them in directly
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch) {
                const jwtSecret = process.env.JWT_SECRET || "mysecretkey123";
                const token = jwt.sign({ id: existingUser._id }, jwtSecret, { expiresIn: "10h" });
                return res.status(200).json({
                    message: "User already exists. Logged in successfully.",
                    token,
                    user: { id: existingUser._id, name: existingUser.name, email: existingUser.email }
                });
            } else {
                return res.status(400).json({ message: "User already exists with a different password. Please login." });
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Auto-login the new user
        const jwtSecret = process.env.JWT_SECRET || "mysecretkey123";
        const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: "10h" });

        res.status(201).json({
            message: "Registration successful!",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT Token
        // Default to 'mysecretkey123' just in case JWT_SECRET is not in .env yet
        const jwtSecret = process.env.JWT_SECRET || "mysecretkey123";
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "10h" });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

export default router;
