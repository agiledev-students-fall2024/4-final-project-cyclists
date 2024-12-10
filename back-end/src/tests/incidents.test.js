import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../app.js';
import Incident from '../models/Incident.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Incidents API Tests', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await Incident.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Incident.deleteMany({});
  });

  describe('POST /api/incidents', () => {
    it('should create a new incident', async () => {
      const incidentData = {
        caption: 'Test Incident',
        longitude: -73.957375,
        latitude: 40.718175,
        duration: 900000,
        timestamp: Date.now(),
      };

      const res = await chai.request(app).post('/api/incidents').send(incidentData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'Incident reported successfully');
      expect(res.body).to.have.property('incident');
      expect(res.body.incident).to.have.property('caption', 'Test Incident');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await chai.request(app).post('/api/incidents').send({ caption: 'Incomplete' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error', 'All fields are required with valid data.');
    });
  });

  describe('Error Handling Middleware', () => {
    let consoleErrorStub;

    before(() => {
      consoleErrorStub = sinon.stub(console, 'error');
    });

    after(() => {
      consoleErrorStub.restore();
    });

    it('should log errors and return a 404 for unknown routes', async () => {
      const res = await chai.request(app).get('/unknown-route');

      expect(consoleErrorStub.calledOnce).to.be.true; 
      expect(consoleErrorStub.firstCall.args[0]).to.include('Error:'); 
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'Not Found');
    });
  });
});
