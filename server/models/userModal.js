const db = require('../config/db');
const users = db.get('users'); // "users" is your collection name

// Optional: Create index for unique email
users.createIndex({ email: 1 }, { unique: true });

module.exports = users;
