//CHANGE TO MATCH SCHEMAS

const User = require('../models/users.model');
const Exercise = require('../models/exercises.model');
const Workout = require('../models/workouts.model');

const seed = async (
  usersData,
  groupsData,
  listsData,
  optionsData,
  decisionsProcessesData,
  decisionsData
) => {
  try {
    await User.deleteMany({});
    await User.insertMany(usersData);
    await Group.deleteMany({});
    await Group.insertMany(groupsData);
    await List.deleteMany({});
    await List.insertMany(listsData);
    await Option.deleteMany({});
    await Option.insertMany(optionsData);
    await DecisionsProcesses.deleteMany({});
    await DecisionsProcesses.insertMany(decisionsProcessesData);
    await Decision.deleteMany({});
    await Decision.insertMany(decisionsData);
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seed;
