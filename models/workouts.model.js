const mongoose = require('mongoose');

const workoutsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now() },
  workout_name: { type: String, required: true },
  exercises: { type: Array, required: true },
  finishedBoolean: { type: Boolean, required: true },
});

module.exports = mongoose.model('Workout', workoutsSchema);
