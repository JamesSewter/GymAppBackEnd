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
};

module.exports = exerciseController;
