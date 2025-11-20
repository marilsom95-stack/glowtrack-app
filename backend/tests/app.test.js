import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Routine from '../src/models/Routine.js';

let mongoServer;
let server;
let baseURL;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  server = app.listen(0);
  const { port } = server.address();
  baseURL = `http://127.0.0.1:${port}/api`;
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  if (server) server.close();
});

let authToken;

test('GET /api/health responde com sucesso', async () => {
  const response = await fetch(`${baseURL}/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.data.status, 'ok');
});

test('POST /api/auth/register cria uma nova utilizadora', async () => {
  const payload = {
    name: 'Glow Tester',
    email: 'teste@glowtrack.com',
    password: 'segredo123',
  };
  const response = await fetch(`${baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.token);
  authToken = body.data.token;
});

test('POST /api/auth/login permite autenticar', async () => {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'teste@glowtrack.com', password: 'segredo123' }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.token);
});

test('GET /api/routine devolve rotinas manhã e noite', async () => {
  const response = await fetch(`${baseURL}/routine`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.morning);
  assert.ok(body.data.night);
  const totalRoutines = await Routine.countDocuments();
  assert.equal(totalRoutines, 2);
});
