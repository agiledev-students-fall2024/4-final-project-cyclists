import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../app.js';
import Route from '../models/Route.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Routes Tests', () => {
    const mockRoutes = [
        {
            name: 'Test Route 1',
            start_location: 'Start 1',
            end_location: 'End 1',
            distance: 5.2,
            duration: 15, // Updated to a number
            geometry: 'Mock geometry 1',
            origin: 'Origin 1',
            destination: 'Destination 1',
        },
        {
            name: 'Test Route 2',
            start_location: 'Start 2',
            end_location: 'End 2',
            distance: 10.5,
            duration: 30, // Updated to a number
            geometry: 'Mock geometry 2',
            origin: 'Origin 2',
            destination: 'Destination 2',
        },
    ];

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Cyclists' });

        // Clear and seed the database with mock data
        await Route.deleteMany({});
        await Route.insertMany(mockRoutes);
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/routes', () => {
        it('should return all routes', async () => {
            const res = await chai.request(app).get('/api/routes');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
        });
    });
});
