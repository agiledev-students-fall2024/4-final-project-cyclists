import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import Route from '../models/Route.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== Routes Tests =====', () => {
  let routeStub, saveStub, findByIdAndDeleteStub, findByIdStub;

  const mockUser = {
    id: '12345',
    username: 'testuser',
    email: 'test@example.com',
  };
  const testRouteData = {
    user: '12345',
    name: 'Test Route',
    start_location: 'Start Location',
    end_location: 'End Location',
    distance: 10,
    duration: 120,
    geometry: { type: 'Point', coordinates: [0, 0] },
    origin: {
      place_name: 'Origin',
      geometry: { type: 'Point', coordinates: [0, 0] },
    },
    destination: {
      place_name: 'Destination',
      geometry: { type: 'Point', coordinates: [1, 1] },
    },
    steps: [
      // Define the steps globally
      {
        order: 1,
        instruction: 'Head north on Main St',
        distance: 5,
        duration: 60,
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      },
      {
        order: 2,
        instruction: 'Turn right onto 2nd Ave',
        distance: 3,
        duration: 30,
        geometry: {
          type: 'LineString',
          coordinates: [
            [1, 1],
            [2, 2],
          ],
        },
      },
    ],
  };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(mockUser, secret, { expiresIn: '1h' });

  beforeEach(() => {
    // Stub the 'find' method of the Route model to return a defined route
    routeStub = sinon.stub(Route, 'find').returns({
      sort: sinon.stub().returns({
        populate: sinon.stub().resolves([
          {
            _id: '1',
            name: 'Test Route',
            user: {
              _id: '12345',
              username: 'testuser',
              email: 'testuser@example.com',
            },
          },
        ]),
      }),
    });

    // Stub the 'save' method to simulate successful creation of a route
    saveStub = sinon
      .stub(Route.prototype, 'save')
      .resolves({ _id: '1', name: 'Test Route' });

    // Stub methods for route deletion and retrieval by ID
    findByIdAndDeleteStub = sinon.stub(Route, 'findByIdAndDelete');
    findByIdStub = sinon.stub(Route, 'findById');
  });

  afterEach(() => {
    routeStub.restore();
    saveStub.restore();
    findByIdAndDeleteStub.restore();
    findByIdStub.restore();
  });

  describe('Get Routes Tests', () => {
    it('should retrieve all routes', async () => {
      const res = await request
        .execute(app)
        .get('/api/routes')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('name');
    });
  });

  describe('Create Route Tests', () => {
    it('should return 201 and the created route on success', async () => {
      const res = await request
        .execute(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send(testRouteData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal('Test Route');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request
        .execute(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Route', // Missing other required fields
        });

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Missing required fields');
    });

    it('should return 500 if there is an error creating the route', async () => {
      saveStub.rejects(new Error('Failed to save route')); // Simulate error

      const res = await request
        .execute(app)
        .post('/api/routes')
        .set('Authorization', `Bearer ${token}`)
        .send(testRouteData);

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to save route');
    });
  });
});
