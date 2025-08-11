const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req,res)=>{
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if(existing) return res.status(400).json({ message: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, status: 'pending' });
  res.json({ success: true, message: 'Pending approval' });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({ message: 'Invalid' });
  const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: '10h' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role, status: user.status }});
});

module.exports = router;
