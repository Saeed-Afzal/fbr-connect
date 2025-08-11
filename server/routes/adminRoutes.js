// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // monk instance
const auth = require('../middleware/authMiddleware'); // token + user check

// Middleware: Only allow admin users
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  const users = db.get('users');
  const allUsers = await users.find({}, { fields: { password: 0 } }); // exclude password
  res.json(allUsers);
});

// Update user status
router.put('/users/:id/status', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'inactive' or 'pending'

  if (!['active', 'inactive', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const users = db.get('users');
  await users.update({ _id: id }, { $set: { status } });
  res.json({ message: 'User status updated' });
});

module.exports = router;
