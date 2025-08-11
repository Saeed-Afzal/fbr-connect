require('dotenv').config();
const express = require('express');
const db = require('./config/db.js'); // ensure connection
const app = express();
const cors = require("cors");


app.use(express.json());

app.use(cors({
  origin: "http://localhost:3004", // ya jo bhi frontend ka origin ho
  credentials: true
}));



// User routes
const userRoutes = require('./routes/userRoutes.js');
app.use('/users', userRoutes);

const invoiceRoutes = require('./routes/invoiceRoutes.js');
app.use('/invoice',invoiceRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// 🔹 Auth routes add karo
const authRoutes = require('./routes/authRoutes.js');
app.use('/api/auth', authRoutes);

// 🔹 Protected route test ke liye (JWT check)
const auth = require('./middleware/authMiddleware.js');
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, you are authorized!` });
});

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
