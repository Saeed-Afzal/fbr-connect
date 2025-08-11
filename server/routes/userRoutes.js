// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/userModel.js');
const router = express.Router();
const auth = require("../middleware/authMiddleware");


// Create User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, status, sandboxToken, productionToken, createdBy } = req.body;

    // Email already exists check
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Password hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await users.insert({
      name,
      email,
      passwordHash,
      role: role || 'user',
      status: status || 'pending',
      sandboxToken: sandboxToken || '',
      productionToken: productionToken || '',
      createdBy: createdBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      useSandbox: true
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Users
router.get("/", async (req, res) => {
  try {
    const allUsers = await users.find({ role: { $ne: "admin" } }); // ❌ Exclude admin
    res.json(allUsers);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/setup', auth, async (req, res) => {
  try {
    const { sandboxToken, productionToken, useSandbox } = req.body;

    const updated = await users.update(
      { _id: req.user._id },
      {
        $set: {
          sandboxToken: sandboxToken || '',
          productionToken: productionToken || '',
          useSandbox,
          updatedAt: new Date(),
        },
      }
    );

    res.json({ message: 'Setup tokens updated successfully', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/setup', auth, async (req, res) => {
  try {
    const userId = req.user._id; // from token payload
    console.log(userId, 'userId');
    
    const user = await users.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      sandboxToken: user.sandboxToken || '',
      productionToken: user.productionToken || '',
      useSandbox: user.useSandbox ?? true, // default to true
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user._id; // from token payload
    console.log(userId, 'userId');
    
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only needed fields (avoid sending password hash)
    const { _id, name, email, status, sandboxToken, productionToken, useSandbox } = user;

    res.json({ _id, name, email, status, sandboxToken, productionToken, useSandbox });
  } catch (error) {
    console.error('Failed to get user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/:id/status", auth, async (req, res) => {
  const { id } = req.params;
  // const users = db.get("users"); // ✅ This is required

  try {
    const currentUser = await users.findOne({ _id: req.user._id });

    // ❌ Unauthorized if not admin
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔍 Find the target user to be updated
    const targetUser = await users.findOne({ _id: id });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = targetUser.status === "active" ? "pending" : "active";

    await users.update(
      { _id: id },
      { $set: { status: newStatus } }
    );

    res.json({ message: "User status updated", status: newStatus });
  } catch (err) {
    console.error("Failed to update user status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
