const User = require('../models/users.model');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const userController = {
  getUserById: async (req, res, next) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError('Invalid user ID', 400));
    }
    try {
      const user = await User.findById(userId);
      user
        ? res.status(200).send(user)
        : next(new AppError('User not found', 404));
    } catch (err) {
      next(err);
    }
  },
  deleteUserById: async (req, res, next) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError('Invalid user ID', 400));
    }
    try {
      const user = await User.findOneAndDelete({ _id: userId });
      user ? res.status(204).send() : next(new AppError('User not found', 404));
    } catch (err) {
      next(err);
    }
  },
  postAUser: async (req, res, next) => {
    const newUser = new User(req.body);
    try {
      const savedUser = await newUser.save();
      res.status(201).send(savedUser);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return next(new AppError('Invalid new user', 400));
      }
      next(err);
    }
  },
  updateUser: async (req, res, next) => {
    const { userId } = req.params;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError('Invalid user ID', 400));
    }
    if (Object.keys(updates).length === 0) {
      return next(new AppError('No fields provided for update', 400));
    }
    const validFields = Object.keys(User.schema.paths);
    const requestedFields = Object.keys(updates);
    const isValidUpdate = requestedFields.every((field) =>
      validFields.includes(field)
    );
    if (!isValidUpdate) {
      return next(new AppError('Invalid update fields', 400));
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return next(new AppError('User not found', 404));
      }

      res.status(200).send(updatedUser);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return next(new AppError('Invalid new user', 400));
      }
      next(err);
    }
  },
};

module.exports = userController;
