import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import app from '../app.js';
import Profile from '../models/Profile.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== Profile Tests =====', () => {
  let saveStub;

  beforeEach(() => {
    saveStub = sinon
      .stub(Profile.prototype, 'save')
      .resolves({ _id: '1', name: 'Test User', email: 'testuser@example.com' });
  });

  afterEach(() => {
    saveStub.restore();
  });

  describe('Create Profile Tests', () => {
    it('should return 201 and the created profile on success', async () => {
      const res = await request.execute(app).post('/api/profiles').send({
        name: 'Test User',
        email: 'testuser@example.com',
        bio: 'This is a test bio.',
        location: 'New York',
      });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('_id');
      expect(res.body.name).to.equal('Test User');
      expect(res.body.email).to.equal('testuser@example.com');
    });

    it('should return 400 if validation fails (missing name)', async () => {
      const res = await request.execute(app).post('/api/profiles').send({
        email: 'testuser@example.com',
        bio: 'This is a test bio.',
        location: 'New York',
      });

      expect(res).to.have.status(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0].msg).to.equal('Name is required');
    });

    it('should return 400 if validation fails (invalid email)', async () => {
      const res = await request.execute(app).post('/api/profiles').send({
        name: 'Test User',
        email: 'invalid-email',
        bio: 'This is a test bio.',
        location: 'New York',
      });

      expect(res).to.have.status(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors[0].msg).to.equal('Valid email is required');
    });

    it('should return 500 if there is a failure saving the profile', async () => {
      saveStub.rejects(new Error('Failed to save profile'));

      const res = await request.execute(app).post('/api/profiles').send({
        name: 'Test User',
        email: 'testuser@example.com',
        bio: 'This is a test bio.',
        location: 'New York',
      });

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('Failed to create profile');
    });
  });
});
