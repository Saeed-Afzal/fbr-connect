// models/userModel.js
const db = require('../config/db');
const users = db.get('users'); // "users" collection ka naam

module.exports = users;
