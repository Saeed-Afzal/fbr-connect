require('dotenv').config()
const monk = require('monk')

const db = monk(process.env.MONGO_URI)

db.then(() => {
  console.log('✅ Connected to MongoDB')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

module.exports = db
