require("dotenv").config()
const mongoose = require('mongoose');
const uri = process.env.DATABASE_URI; // Connection string from .env

mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connection successful');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});
