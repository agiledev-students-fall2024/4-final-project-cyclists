import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Incident Controller', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.db.dropDatabase(); // Clear test database
        await mongoose.connection.close();
    });

    it('should report a new incident successfully', async () => {
        const res = await request(app).post('/api/incidents').send({
            image: 'test_image.png',
            caption: 'Test Caption',
            longitude: -122.084,
            latitude: 37.422,
            date: '2024-01-01T00:00:00Z',
        });
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Incident reported successfully');
    });

    it('should return an error if any field is missing', async () => {
        const res = await request(app).post('/api/incidents').send({
            caption: 'Test Caption',
        });
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('All fields are required with valid data.');
    });
});
