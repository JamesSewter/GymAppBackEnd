const connectDB = require('./db/database');
const cors = require('cors');
const express = require("express")
const router = express.Router()

const healthController = require('./controllers/controller.health');

connectDB()

const server = express()
server.use(express.json());

//do routes

router.get("/api", healthController.healthCheck)


server.use(router);

//error handling middleware here
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = server

