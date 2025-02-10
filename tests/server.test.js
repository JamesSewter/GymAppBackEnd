require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const seed = require('../db/seed');

//this goes into seed function
const usersData = require('../db/test-data/test-users');
const exercisesData = require('../db/test-data/test-exercises');
const workoutsData = require('../db/test-data/test-workouts.js');

//these used when awaiting to find one by id when doing delete testing
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
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.parse(endpoints));
  });
});

//Users - GET, DELETE, POST, PATCH:
describe('GET /api/users/:userId', () => {
  test('200: responds with a user for corresponding user ID', async () => {
    const testUserId = '679b70c0ebe324047c9ca19d';
    const response = await request(server)
      .get(`/api/users/${testUserId}`)
      .expect(200);
    expect(response.body.user).toMatchObject({
      _id: testUserId,
      username: expect.any(String),
      password: expect.any(String),
      weight: expect.any(Number),
    });
  });
  test('404: responds with an error if there is no corresponding userId', async () => {
    const testUserId = '00000a00000b00000c00000d';
    const response = await request(server)
      .get(`/api/users/${testUserId}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  test('400: Respond with bad request error message for when user ID is invalid', async () => {
    const testUserId = 'notANumber';
    const response = await request(server)
      .get(`/api/users/${testUserId}`)
      .expect(400);
    expect(response.body.error).toBe('Invalid user ID');
  });
});

describe('DELETE /api/users/:userId', () => {
  test('204: deletes a user for corresponding user ID', async () => {
    const testUserId = '679b70c0ebe324047c9ca19d';
    await request(server).delete(`/api/users/${testUserId}`).expect(204);
    await request(server).get(`/api/users/${testUserId}`).expect(404);
  });
  test('404: responds with an error if there is no corresponding userId', async () => {
    const testUserId = '00000a00000b00000c00000d';
    await request(server).get(`/api/users/${testUserId}`).expect(404);
    const response = await request(server)
      .delete(`/api/users/${testUserId}`)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  test('400: Respond with bad request error message for when user ID is invalid', async () => {
    const testUserId = 'notANumber';
    const response = await request(server)
      .delete(`/api/users/${testUserId}`)
      .expect(400);
    expect(response.body.error).toBe('Invalid user ID');
  });
});
