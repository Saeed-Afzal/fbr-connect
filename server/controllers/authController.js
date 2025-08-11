const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.insert({
        name,
        email,
        password: hashed,
        role: 'user',
        status: 'pending'
    });

    res.status(201).json({ message: 'User created, pending approval' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.status === 'pending') {
        return res.status(403).json({ message: 'Account pending approval' });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};
