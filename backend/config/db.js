const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('⚠️ NOTE: Please make sure to replace <db_password> in backend/.env with your actual MongoDB password.');
    // Don't exit process so server can still serve frontend
    // process.exit(1);
  }
};

module.exports = connectDB;
