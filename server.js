const connectDB = require('./db/database');
const cors = require('cors');
const express = require('express');
const router = express.Router();
const AppError = require('./utils/AppError');

const healthController = require('./controllers/controller.health');
const userController = require('./controllers/users.controller');
const exerciseController = require('./controllers/exercises.controller');
const workoutController = require('./controllers/workouts.controller');

connectDB();

const server = express();
server.use(express.json());

router.get('/api', healthController.healthCheck);
//USERS
router.get('/api/users/:userId', userController.getUserById);
router.delete('/api/users/:userId', userController.deleteUserById);
router.post('/api/users', userController.postAUser);
router.patch('/api/users/:userId', userController.updateUser);
//EXERCISES
router.get('/api/exercises/:exerciseId', exerciseController.getExerciseById);
router.delete('/api/exercises/:exerciseId', exerciseController.deleteExerciseById);
router.post('/api/exercises', exerciseController.postAnExercise);
router.patch('/api/exercises/:exerciseId', exerciseController.updateExercise);
//WORKOUTS
router.get('/api/workouts/:workoutId', workoutController.getWorkoutById);
//
//
//


server.use(router);
//error handling middleware here - separated concerns, error handled here, business logic in controller, errors defined by AppError
server.use((err, req, res, next) => {
  //console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = server;
