const Exercise = require('../models/exercises.model');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const exerciseController = {
  getExerciseById: async (req, res, next) => {
    const { exerciseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return next(new AppError('Invalid exerciseId', 400));
    }
    try {
      const exercise = await Exercise.findById(exerciseId);
      exercise
        ? res.status(200).send(exercise)
        : next(new AppError('Exercise not found', 404));
    } catch (err) {
      next(err);
    }
  },
  deleteExerciseById: async (req, res, next) => {
    const { exerciseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return next(new AppError('Invalid exercise ID', 400));
    }
    try {
      const exercise = await Exercise.findOneAndDelete({ _id: exerciseId });
      exercise
        ? res.status(204).send()
        : next(new AppError('Exercise not found', 404));
    } catch (err) {
      next(err);
    }
  },
  postAnExercise: async (req, res, next) => {
    const newExercise = new Exercise(req.body);
    try {
      const savedExercise = await newExercise.save();
      res.status(201).send(savedExercise);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return next(new AppError('Invalid new exercise', 400));
      }
      next(err);
    }
  },
};

module.exports = exerciseController;
