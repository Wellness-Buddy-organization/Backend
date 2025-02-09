const User = require('../models/User');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Server error while fetching users.", details: error.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields (name, email, password) are required." });
        }

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists. Please use a different email." });
        }

        // Create and save new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Server error while creating user.", details: error.message });
    }
};
