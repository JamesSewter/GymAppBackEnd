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
};

module.exports = userController;
