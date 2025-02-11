const Workout = require('../models/workouts.model');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const workoutController = {
  getWorkoutById: async (req, res, next) => {
    const { workoutId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return next(new AppError('Invalid workout ID', 400));
    }
    try {
      const workout = await Workout.findById(workoutId);
      workout
        ? res.status(200).send(workout)
        : next(new AppError('Workout not found', 404));
    } catch (err) {
      next(err);
    }
  },
  postAWorkout: async (req, res, next) => {
    const newWorkout = new Workout(req.body);
    try {
      const savedWorkout = await newWorkout.save();
      res.status(201).send(savedWorkout);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return next(new AppError('Invalid new workout', 400));
      }
      next(err);
    }
  },
};

module.exports = workoutController;
