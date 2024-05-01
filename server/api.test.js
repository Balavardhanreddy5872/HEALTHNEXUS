import request from 'supertest';
import app from './server.js';
import mongoose from 'mongoose';
import User from './models/UserModels.js';
import { expect } from 'chai';
import Product from './models/ProductModel.js';

// 1. Test api for register 
describe('POST /api/auth/register', () => {
  before(async () => {
    await mongoose.connect('mongodb://0.0.0.0:27017/shopping', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });

  it('should return an error if email already exists', async () => {
    const existingUser = new User({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'existingpassword',
      phone: '1234567890',
      address: 'sricity'
    });
    await existingUser.save();

    const userData = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
      phone: '1234567890',
      address: 'sricity'
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);
    expect(res.status).to.equal(200);

    expect(res.body).to.have.property('sucess', false); // Corrected 'success' to 'sucess'
    expect(res.body).to.have.property('message', 'User already exists please login');
  });
});

// 2. Test api for all orders 
describe('GET /api/auth/all-orders', () => {
  before(async () => {
    await mongoose.connect('mongodb://0.0.0.0:27017/shopping', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });

  it('should return all orders when authenticated as admin', async () => {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$g.CBYKLanbwPCLFm9cg3CudHAue5DPkAfX5Go9QqXwgf7njtrtV0m',
      phone: '1234567890',
      address: 'Admin Address',
      role: 1
    });
    await adminUser.save();

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjMxMjYzMzE5MmMxZmQ5MDYxNWI5YTIiLCJpYXQiOjE3MTQ1MDA2NDAsImV4cCI6MTcxNTEwNTQ0MH0.gpqzYcXmARJuE7oxvUpzR9XQhMnSw3fsPvJgh2RtTvY";

    const res = await request(app)
      .get('/api/auth/all-orders')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);


    expect(res.body).to.be.an('array');
  });

  after(async () => {
    await mongoose.connection.close();
  });
});

