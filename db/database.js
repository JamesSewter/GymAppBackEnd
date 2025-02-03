const mongoose = require('mongoose');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const uri = process.env.DATABASE_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.log('Database error:', error);
  }
}

module.exports = connectDB;