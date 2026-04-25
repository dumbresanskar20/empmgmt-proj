const mongoose = require('mongoose');

let gfs;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,   // 10s to find a server
      socketTimeoutMS: 45000,            // 45s socket inactivity
      connectTimeoutMS: 10000,           // 10s initial connection
      maxPoolSize: 10,                   // Connection pool
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize GridFSBucket
    gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'uploads'
    });

    // Handle connection events after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully.');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('⚠️ NOTE: Please make sure to replace <db_password> in backend/.env with your actual MongoDB password.');
    process.exit(1); // Exit — don't run the server without a DB connection
  }
};

const getGfs = () => gfs;

module.exports = { connectDB, getGfs };
