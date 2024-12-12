import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import app from '../app.js';
import Incident from '../models/Incident.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== Incidents Tests =====', () => {
  let incidentStub, saveStub, findByIdAndDeleteStub, findByIdStub;

  beforeEach(() => {
    // Stub the 'find' method of the Incident model to return a defined incident
    incidentStub = sinon.stub(Incident, 'find').returns({
      sort: sinon.stub().returns([{ _id: '1', caption: 'Test Incident' }]),
    });
    
    // Stub the 'save' method to simulate successful creation of an incident
    saveStub = sinon
    .stub(Incident.prototype, 'save')
    .resolves({ _id: '1', caption: 'Test Incident' });
    
    // Stub methods for incident deletion and retrieval by ID
    findByIdAndDeleteStub = sinon.stub(Incident, 'findByIdAndDelete');
    findByIdStub = sinon.stub(Incident, 'findById');
  });

  afterEach(() => {
    incidentStub.restore();
    saveStub.restore();
    findByIdAndDeleteStub.restore();
    findByIdStub.restore();
  });

  describe('Get Incidents Tests', () => {
    it('should retrieve all incidents', async () => {
      const res = await request.execute(app).get('/api/incidents');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('_id');
      expect(res.body[0]).to.have.property('caption');
    });
  });

  describe('Report Incidents Tests', () => {
    it('should return 201 and the created incident on success', async () => {
      const res = await request.execute(app).post('/api/incidents').send({
        caption: 'Test Incident',
        latitude: '40.7128',
        longitude: '-74.0060',
        duration: 60,
        timestamp: 1609459200000,
      });

      expect(res).to.have.status(201);
      expect(res.body.message).to.equal('Incident reported successfully');
      expect(res.body.incident).to.have.property('_id');
      expect(res.body.incident).to.have.property('caption');
    });

    it('should return 500 if there is a failure in reporting an incident', async () => {
      saveStub.rejects(new Error('Failed to save incident')); // Simulate error

      const res = await request.execute(app).post('/api/incidents').send({
        caption: 'Test Incident',
        latitude: '40.7128',
        longitude: '-74.0060',
        duration: 60,
        timestamp: 1609459200000,
      });

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to save incident');
    });
  });

  describe('Delete Incident Tests', () => {
    it('should delete the incident and return a success message', async () => {
      findByIdAndDeleteStub.resolves({ _id: '1', caption: 'Test Incident' });

      const res = await request.execute(app).delete('/api/incidents/1');

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Incident deleted successfully');
    });

    it('should return 404 if the incident does not exist', async () => {
      findByIdAndDeleteStub.resolves(null);

      const res = await request.execute(app).delete('/api/incidents/1');

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Incident not found');
    });

    it('should return 500 if there is an error deleting the incident', async () => {
      findByIdAndDeleteStub.rejects(new Error('Failed to delete incident'));

      const res = await request.execute(app).delete('/api/incidents/1');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to delete incident');
    });
  });

  describe('Get Incident by ID Tests', () => {
    it('should return a single incident on success', async () => {
      findByIdStub.resolves({ _id: '1', caption: 'Test Incident' });

      const res = await request.execute(app).get('/api/incidents/1');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id');
      expect(res.body._id).to.equal('1');
      expect(res.body.caption).to.equal('Test Incident');
    });

    it('should return 404 if the incident is not found', async () => {
      findByIdStub.resolves(null);

      const res = await request.execute(app).get('/api/incidents/1');

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Incident not found');
    });

    it('should return 500 if there is an error retrieving the incident', async () => {
      findByIdStub.rejects(new Error('Failed to get incident'));

      const res = await request.execute(app).get('/api/incidents/1');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to get incident');
    });
  });
});
