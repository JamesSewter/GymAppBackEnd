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
  updateExercise: async (req, res, next) => {
    const { exerciseId } = req.params;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return next(new AppError('Invalid exercise ID', 400));
    }
    if (Object.keys(updates).length === 0) {
      return next(new AppError('No fields provided for update', 400));
    }
    const validFields = Object.keys(Exercise.schema.paths);
    const requestedFields = Object.keys(updates);
    const isValidUpdate = requestedFields.every((field) =>
      validFields.includes(field)
    );
    if (!isValidUpdate) {
      return next(new AppError('Invalid update fields', 400));
    }
    try {
      const updatedExercise = await Exercise.findByIdAndUpdate(
        exerciseId,
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updatedExercise) {
        return next(new AppError('Exercise not found', 404));
      }

      res.status(200).send(updatedExercise);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return next(new AppError('Invalid new exercise', 400));
      }
      next(err);
    }
  },
};

module.exports = exerciseController;
