const User = require('../models/users.model');
const Exercise = require('../models/exercises.model');
const Workout = require('../models/workouts.model');

const seed = async (
  usersData,
  exercisesData,
  workoutsData,
) => {
  try {
    await User.deleteMany({});
    await User.insertMany(usersData);
    await Exercise.deleteMany({});
    await Exercise.insertMany(exercisesData);
    await Workout.deleteMany({});
    await Workout.insertMany(workoutsData);
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seed;
