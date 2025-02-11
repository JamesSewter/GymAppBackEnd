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
    expect(response.body).toMatchObject({
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

describe('POST /api/users', () => {
  test('201: posts a new user and responds with the new user when weight given', async () => {
    newUser = {
      username: 'James',
      password: 'verysecurepassword66',
      weight: 80,
    };
    const response = await request(server)
      .post(`/api/users`)
      .send(newUser)
      .expect(201);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      username: expect.any(String),
      password: expect.any(String),
      weight: expect.any(Number),
      __v: 0,
    });
  });
  test('201: posts a new user and responds with the new user when weight not given', async () => {
    newUser = {
      username: 'James',
      password: 'verysecurepassword66',
    };
    const response = await request(server)
      .post(`/api/users`)
      .send(newUser)
      .expect(201);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      username: expect.any(String),
      password: expect.any(String),
      __v: 0,
    });
  });
  test('400: responds with bad request message when new user does not match the schema', async () => {
    const newUser = {
      password: 'verysecurepassword66',
      weight: 80,
    };
    const response = await request(server)
      .post(`/api/users`)
      .send(newUser)
      .expect(400);
    expect(response.body.error).toBe('Invalid new user');
  });
});

describe('PATCH /api/users/:userId', () => {
  test('200: patches an existing user and responds with the updated user', async () => {
    const newWeight = { weight: 85 };
    const testUserId = '679b70c0ebe324047c9ca19d';
    const response = await request(server)
      .patch(`/api/users/${testUserId}`)
      .send(newWeight)
      .expect(200);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      username: expect.any(String),
      password: expect.any(String),
      weight: 85,
      __v: 0,
    });
  });
  test('404: responds with an error if there is no corresponding userId', async () => {
    const newWeight = { weight: 85 };
    const testUserId = '00000a00000b00000c00000d';
    const response = await request(server)
      .patch(`/api/users/${testUserId}`)
      .send(newWeight)
      .expect(404);
    expect(response.body.error).toBe('User not found');
  });
  test('400: Respond with bad request error message for when user ID is invalid', async () => {
    const newWeight = { weight: 85 };
    const testUserId = 'notANumber';
    const response = await request(server)
      .patch(`/api/users/${testUserId}`)
      .send(newWeight)
      .expect(400);
    expect(response.body.error).toBe('Invalid user ID');
  });
  test('400: Responds with bad request error when request body is invalid', async () => {
    const testUserId = '679b70c0ebe324047c9ca19d';
    const response = await request(server)
      .patch(`/api/users/${testUserId}`)
      .send({ invalidField: 'thisShouldNotExist' })
      .expect(400);
    expect(response.body.error).toBe('Invalid update fields');
  });
  test('400: Responds with bad request error when empty request body', async () => {
    const testUserId = '679b70c0ebe324047c9ca19d';
    const response = await request(server)
      .patch(`/api/users/${testUserId}`)
      .send()
      .expect(400);
    expect(response.body.error).toBe('No fields provided for update');
  });
});

//Exercises - GET, DELETE, POST, PATCH:
describe('GET /api/exercise/:exerciseId', () => {
  test('200: Responds with an exercise  corresponding to a valid exerciseId', async () => {
    const exerciseId = '679b71afebe324047c9ca1a8';
    const response = await request(server)
      .get(`/api/exercises/${exerciseId}`)
      .expect(200);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      exercise_name: 'Bench Press',
      bodyweightBoolean: false,
      suggestions: null,
      sets: 3,
      reps: [8, 8, 7],
      weights: [80, 80, 80],
      notes: null,
      finishedBoolean: false,
      strengthScore: null,
      __v: 0,
    });
  });
  test('404: responds with an error if there is no corresponding exerciseId', async () => {
    const testExerciseId = '00000a00000b00000c00000d';
    const response = await request(server)
      .get(`/api/exercises/${testExerciseId}`)
      .expect(404);
    expect(response.body.error).toBe('Exercise not found');
  });
  test('400: Respond with bad request error message for when exerciseId is invalid', async () => {
    const testExerciseId = 'notANumber';
    const response = await request(server)
      .get(`/api/exercises/${testExerciseId}`)
      .expect(400);
    expect(response.body.error).toBe('Invalid exerciseId');
  });
});

describe('DELETE /api/exercises/:exerciseId', () => {
  test('204: deletes an exercise for corresponding exercise ID', async () => {
    const testExerciseId = '679b71afebe324047c9ca1a8';
    await request(server)
      .delete(`/api/exercises/${testExerciseId}`)
      .expect(204);
    await request(server).get(`/api/exercises/${testExerciseId}`).expect(404);
  });
  test('404: responds with an error if there is no corresponding exerciseId', async () => {
    const testExerciseId = '00000a00000b00000c00000d';
    await request(server).get(`/api/exercises/${testExerciseId}`).expect(404);
    const response = await request(server)
      .delete(`/api/exercises/${testExerciseId}`)
      .expect(404);
    expect(response.body.error).toBe('Exercise not found');
  });
  test('400: Respond with bad request error message for when exercise ID is invalid', async () => {
    const testExerciseId = 'notANumber';
    const response = await request(server)
      .delete(`/api/exercises/${testExerciseId}`)
      .expect(400);
    expect(response.body.error).toBe('Invalid exercise ID');
  });
});

describe('POST /api/exercises', () => {
  test('201: posts a new exercise and responds with the new exercise', async () => {
    newExercise = {
      exercise_name: 'Tricep pushdown',
      bodyweightBoolean: false,
      suggestions: null,
      sets: null,
      reps: null,
      weights: null,
      notes: null,
      finishedBoolean: false,
      strengthScore: null,
    };
    const response = await request(server)
      .post(`/api/exercises`)
      .send(newExercise)
      .expect(201);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      exercise_name: expect.any(String),
      bodyweightBoolean: expect.any(Boolean),
      suggestions: null,
      sets: null,
      reps: null,
      weights: null,
      notes: null,
      finishedBoolean: expect.any(Boolean),
      strengthScore: null,
      __v: 0,
    });
  });
  test('400: responds with bad request message when new exercise does not match the schema', async () => {
    const newExercise = {
      name: 'i do not match the schema',
    };
    const response = await request(server)
      .post(`/api/exercises`)
      .send(newExercise)
      .expect(400);
    expect(response.body.error).toBe('Invalid new exercise');
  });
});

describe('PATCH /api/exercises/:exerciseId', () => {
  test('200: patches an existing exercise and responds with the updated exercise', async () => {
    const updatedData = {
      sets: 4,
      reps: [8, 8, 7, 7],
      weights: [80, 80, 80, 80],
      finishedBoolean: true,
    };
    const testExerciseId = '679b71afebe324047c9ca1a9';
    const response = await request(server)
      .patch(`/api/exercises/${testExerciseId}`)
      .send(updatedData)
      .expect(200);
    expect(response.body).toMatchObject({
      _id: '679b71afebe324047c9ca1a9',
      exercise_name: 'Incline Dumbbell Press',
      bodyweightBoolean: false,
      suggestions: null,
      sets: 4,
      reps: [8, 8, 7, 7],
      weights: [80, 80, 80, 80],
      notes: null,
      finishedBoolean: true,
      strengthScore: null,
      __v: 0,
    });
  });
  test('404: responds with an error if there is no corresponding exerciseId', async () => {
    const updatedData = {
      sets: 4,
      reps: [8, 8, 7, 7],
      weights: [80, 80, 80, 80],
      finishedBoolean: true,
    };
    const testExerciseId = '00000a00000b00000c00000d';
    const response = await request(server)
      .patch(`/api/exercises/${testExerciseId}`)
      .send(updatedData)
      .expect(404);
    expect(response.body.error).toBe('Exercise not found');
  });
  test('400: Respond with bad request error message for when exercise ID is invalid', async () => {
    const updatedData = {
      sets: 4,
      reps: [8, 8, 7, 7],
      weights: [80, 80, 80, 80],
      finishedBoolean: true,
    };
    const testExerciseId = 'notANumber';
    const response = await request(server)
      .patch(`/api/exercises/${testExerciseId}`)
      .send(updatedData)
      .expect(400);
    expect(response.body.error).toBe('Invalid exercise ID');
  });
  test('400: Responds with bad request error when request body is invalid', async () => {
    const testExerciseId = '679b71afebe324047c9ca1a9';
    const response = await request(server)
      .patch(`/api/exercises/${testExerciseId}`)
      .send({ invalidField: 'thisShouldNotExist' })
      .expect(400);
    expect(response.body.error).toBe('Invalid update fields');
  });
  test('400: Responds with bad request error when empty request body', async () => {
    const testExerciseId = '679b70c0ebe324047c9ca19d';
    const response = await request(server)
      .patch(`/api/exercises/${testExerciseId}`)
      .send()
      .expect(400);
    expect(response.body.error).toBe('No fields provided for update');
  });
});

//Workouts - GET, DELETE, POST, PATCH:
describe('GET /api/workouts/:workoutId', () => {
  test('200: Responds with a workout corresponding to a valid workoutId', async () => {
    const testWorkoutId = '679b7223ebe324047c9ca1b2';
    const response = await request(server)
      .get(`/api/workouts/${testWorkoutId}`)
      .expect(200);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      date: expect.any(String),
      workout_name: 'Chest and Triceps',
      exercises: [1, 2, 3],
      finishedBoolean: false,
    });
  });
  test('404: responds with an error if there is no corresponding workoutId', async () => {
    const testWorkoutId = '00000a00000b00000c00000d';
    const response = await request(server)
      .get(`/api/workouts/${testWorkoutId}`)
      .expect(404);
    expect(response.body.error).toBe('Workout not found');
  });
  test('400: Respond with bad request error message for when workoutId is invalid', async () => {
    const testWorkoutId = 'notANumber';
    const response = await request(server)
      .get(`/api/workouts/${testWorkoutId}`)
      .expect(400);
    expect(response.body.error).toBe('Invalid workout ID');
  });
});

describe('POST /api/workouts', () => {
  test('201: posts a new workout and responds with the new workout', async () => {
    newWorkout = {
      date: Date.now(),
      workout_name: 'Left body',
      exercises: [4, 5],
      finishedBoolean: false,
    };
    const response = await request(server)
      .post(`/api/workouts`)
      .send(newWorkout)
      .expect(201);
    expect(response.body).toMatchObject({
      date: expect.any(String),
      workout_name: 'Left body',
      exercises: [4, 5],
      finishedBoolean: false,
    });
  });
  test('400: responds with bad request message when new workout does not match the schema', async () => {
    const newWorkout = {
      name: 'i do not match the schema',
    };
    const response = await request(server)
      .post(`/api/workouts`)
      .send(newWorkout)
      .expect(400);
    expect(response.body.error).toBe('Invalid new workout');
  });
});
