import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Auth Controller', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Cyclists' });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/auth/signup', () => {
        it('should sign up a new user successfully', async () => {
            const res = await request(app).post('/api/auth/signup').send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });
            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('User registered successfully');
        });

        it('should return an error if user already exists', async () => {
            await request(app).post('/api/auth/signup').send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });
            const res = await request(app).post('/api/auth/signup').send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
            });
            expect(res.status).to.equal(409);
            expect(res.body.message).to.equal('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should log in an existing user successfully', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'testuser@example.com',
                password: 'password123',
            });
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Login successful');
        });

        it('should return an error for invalid credentials', async () => {
            const res = await request(app).post('/api/auth/login').send({
                email: 'wronguser@example.com',
                password: 'wrongpassword',
            });
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Invalid credentials');
        });
    });
});
