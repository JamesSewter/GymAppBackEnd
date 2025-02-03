require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const seed = require('../db/seed');

//CHANGE
//this goes into seed function
const usersData = require('../db/test-data/test-users');
const exercisesData = require('../db/test-data/test-exercises');
const workoutsData = require('../db/test-data/test-workouts');

const User = require('../models/users.model');
const Exercise = require('../models/exercises.model');
const Workout = require('../models/workouts.model');

const fs = require('fs/promises');


const uri = process.env.DATABASE_URI; //currently test and dev are the same uri


beforeAll(async () => {
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await seed(usersData, exercisesData, workoutsData);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api', () => {
  test('200: serves the endpoints.json file', async () => {
    const endpoints = await fs.readFile(
      `${__dirname}/../endpoints.json`,
      'UTF8'
    );
    const response = await request(server).get('/api');
    console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.parse(endpoints));
  });
});

//write more tests here
