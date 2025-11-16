import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Routine from '../src/models/Routine.js';

let mongoServer;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

let authToken;

test('GET /api/health responde com sucesso', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.data.status, 'ok');
});

test('POST /api/auth/register cria uma nova utilizadora', async () => {
  const payload = {
    name: 'Glow Tester',
    email: 'teste@glowtrack.com',
    password: 'segredo123',
  };
  const response = await request(app).post('/api/auth/register').send(payload);
  assert.equal(response.statusCode, 200);
  assert.ok(response.body.data.token);
  authToken = response.body.data.token;
});

test('POST /api/auth/login permite autenticar', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'teste@glowtrack.com', password: 'segredo123' });
  assert.equal(response.statusCode, 200);
  assert.ok(response.body.data.token);
});

test('GET /api/routine devolve rotinas manhã e noite', async () => {
  const response = await request(app)
    .get('/api/routine')
    .set('Authorization', `Bearer ${authToken}`);
  assert.equal(response.statusCode, 200);
  assert.ok(response.body.data.morning);
  assert.ok(response.body.data.night);
  const totalRoutines = await Routine.countDocuments();
  assert.equal(totalRoutines, 2);
});
