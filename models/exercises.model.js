const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  exercise_name: { type: String, required: true },
  bodyweightBoolean: { type: Boolean, required: true },
  suggestions: { type: String },
  sets: { type: Number },
  reps: [{ type: Number }], 
  weights: [{ type: Number }],
  notes: { type: String },
  finishedBoolean: { type: Boolean, required: true },
  strengthScore: { type: Number },
});

module.exports = mongoose.model('Exercise', exerciseSchema);

//Include date??



