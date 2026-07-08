const mongoose = require('mongoose')

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/madhav_event'

  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB:', uri)
  } catch (err) {
    console.error('❌ Could not connect to MongoDB:', err.message)
    console.error('   Make sure MongoDB is running, or set MONGODB_URI in backend/.env to your Atlas connection string.')
    process.exit(1)
  }
}

module.exports = connectDB
