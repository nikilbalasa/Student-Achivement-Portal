const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'student_achievements',
  });
  isConnected = true;
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB');
}

module.exports = { connectToDatabase };


