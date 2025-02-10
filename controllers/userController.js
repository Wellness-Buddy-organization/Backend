const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.signUpUser = async (req, res) => {
    const { name, employee_id, password } = req.body;

    if (!name || !employee_id || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ employee_id });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, employee_id, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Server error" });
    }
};

// Login User
exports.signInUser = async (req, res) => {
    const { employee_id, password } = req.body;

    if (!employee_id || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ employee_id });
        if (!user) {
            return res.status(400).json({ message: "Invalid employee_id or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid employee_id or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
