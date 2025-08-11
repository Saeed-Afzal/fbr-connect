// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await users.insert({
            name,
            email,
            passwordHash: hashedPassword,
            role: 'user',
            status: 'pending',
            sandboxToken: '',
            productionToken: '',
            createdBy: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({ message: "User registered", user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await users.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await users.find({});
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
