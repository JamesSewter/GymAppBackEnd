const mongoose = require('mongoose');

const workouts = [
  {
    _id: new mongoose.Types.ObjectId('679b7223ebe324047c9ca1b2'),
    date: '2025-01-30',
    workout_name: 'Chest and Triceps',
    exercises: [1, 2, 3],
    finishedBoolean: false,
  },
  {
    _id: new mongoose.Types.ObjectId('679b7223ebe324047c9ca1b3'),
    date: '2025-01-30',
    workout_name: 'Back and Biceps',
    exercises: [4, 5],
    finishedBoolean: false,
  },
  {
    _id: new mongoose.Types.ObjectId('679b7223ebe324047c9ca1b4'),
    date: '2025-01-30',
    workout_name: 'Leg Day',
    exercises: [6, 7],
    finishedBoolean: false,
  },
  {
    _id: new mongoose.Types.ObjectId('679b7223ebe324047c9ca1b5'),
    date: '2025-01-30',
    workout_name: 'Shoulders and Arms',
    exercises: [8, 9, 10],
    finishedBoolean: false,
  },
];

module.exports = workouts;
