// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   role: { type: String, enum: ['superadmin','admin','user'], default: 'user' },
//   status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
//   sandboxToken: { type: String, default: '' },
//   productionToken: { type: String, default: '' },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for admin-created users
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);
