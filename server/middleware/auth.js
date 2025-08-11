const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { protect, roleCheck };
