const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Monk DB instance

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const users = db.get('users'); // users collection
    const user = await users.findOne({ _id: userId }); // Monk handles ObjectId internally

    if (!user || user.status !== 'active') {
      return res.status(403).json({ message: 'User not authorized or inactive.' });
    }
    console.log(user, 'user');
    
    req.user = user;
    next();
  } catch (err) {
    console.log(err, 'err');
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
