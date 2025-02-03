const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exercise_name: { type: String, required: true },
  bodyweightBoolean: { type: Boolean, required: true },
  suggestions: { type: String, required: false },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weights: { type: Number, required: false },
  notes: { type: String, required: true },
  finishedBoolean: { type: Boolean, required: true },
  strengthScore: { type: Number, required: false },
});

module.exports = mongoose.model('Exercise', exerciseSchema);
