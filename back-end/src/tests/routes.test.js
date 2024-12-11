import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import app from '../app.js';
import Route from '../models/Route.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== Routes Tests =====', () => {
  let routeStub, saveStub, findByIdAndDeleteStub, findByIdStub;

  beforeEach(() => {
    // Stub the 'find' method of the Route model to return a defined route
    routeStub = sinon.stub(Route, 'find').returns({
      sort: sinon.stub().returns([{ _id: '1', name: 'Test Route' }]),
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
      const res = await request.execute(app).get('/api/routes');

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
        .send({
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
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal('Test Route');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request.execute(app).post('/api/routes').send({
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
        .send({
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
        });

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to save route');
    });
  });

  describe('Delete Route Tests', () => {
    it('should delete the route and return a success message', async () => {
      findByIdAndDeleteStub.resolves({ _id: '1', name: 'Test Route' });

      const res = await request.execute(app).delete('/api/routes/1');

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Route deleted successfully');
    });

    it('should return 404 if the route does not exist', async () => {
      findByIdAndDeleteStub.resolves(null);

      const res = await request.execute(app).delete('/api/routes/1');

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Route not found');
    });

    it('should return 500 if there is an error deleting the route', async () => {
      findByIdAndDeleteStub.rejects(new Error('Failed to delete route'));

      const res = await request.execute(app).delete('/api/routes/1');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to delete route');
    });
  });

  describe('Get Route by ID Tests', () => {
    it('should return a single route on success', async () => {
      findByIdStub.resolves({ _id: '1', name: 'Test Route' });

      const res = await request.execute(app).get('/api/routes/1');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id');
      expect(res.body._id).to.equal('1');
      expect(res.body.name).to.equal('Test Route');
    });

    it('should return 404 if the route is not found', async () => {
      findByIdStub.resolves(null);

      const res = await request.execute(app).get('/api/routes/1');

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Route not found');
    });

    it('should return 500 if there is an error retrieving the route', async () => {
      findByIdStub.rejects(new Error('Failed to get route'));

      const res = await request.execute(app).get('/api/routes/1');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to retrieve route');
    });
  });
});
