import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import app from '../app.js';
import { User } from '../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== Authentication Tests =====', () => {
  let userStub, bcryptStub;

  beforeEach(() => {
    userStub = sinon.stub(User, 'findOne');
    bcryptStub = sinon.stub(bcrypt, 'compare');
  });

  afterEach(() => {
    userStub.restore();
    bcryptStub.restore();
  });

  describe('Signup Tests', () => {
    it('should return 400 if require fields are missing', async () => {
      const res = await request.execute(app).post('/api/auth/signup').send({});

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal(
        'Username, email, and password are required'
      );
    });

    it('should return 409 if the user already exists', async () => {
      userStub.resolves({ email: 'test@example.com' });

      const res = await request.execute(app).post('/api/auth/signup').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(409);
      expect(res.body.error).to.equal('User already exists');
    });

    it('should return 201 and a token on successful signup', async () => {
      userStub.resolves(null);

      const saveStub = sinon.stub(User.prototype, 'save').resolves();

      const res = await request.execute(app).post('/api/auth/signup').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(201);
      expect(res.body.message).to.equal('User registered successfully');
      expect(res.body).to.have.property('token');

      saveStub.restore();
    });
  });

  describe('Login Tests', () => {
    it('should return 401 if user does not exist', async () => {
      userStub.resolves(null); // Simulate user not found

      const res = await request.execute(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(401);
      expect(res.body.error).to.equal('Invalid email credential');
    });

    it('should return 401 if passwords do not match', async () => {
      userStub.resolves({
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      bcryptStub.resolves(false);

      const res = await request.execute(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res).to.have.status(401);
      expect(res.body.error).to.equal('Invalid password credential');
    });

    it('should return 200 and a token on successful login', async () => {
      userStub.resolves({
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedpassword',
      });
      bcryptStub.resolves(true);

      const res = await request.execute(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Login successful');
      expect(res.body).to.have.property('token');
    });
  });

  describe('Reset Password Tests', () => {
    it('should return 404 if user is not found', async () => {
      userStub.resolves(null);

      const res = await request
        .execute(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'nonexistent@example.com',
          password: 'newpassword123',
        });

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('User not found');
    });

    it('should return 200 and success message on successful password reset', async () => {
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'oldpassword',
        save: sinon.stub().resolves(),
      };

      userStub.resolves(user);

      bcryptStub.resolves('hashedpassword123');

      const res = await request
        .execute(app)
        .post('/api/auth/reset-password')
        .send({
          email: 'test@example.com',
          password: 'newpassword123',
        });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Password updated successfully');
    });
  });

  describe('Forgot Password Tests', () => {
    it('should return 404 if user is not found', async () => {
      userStub.resolves(null);

      const res = await request
        .execute(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('User not found');
    });

    it('should return 200 if user is found', async () => {
      userStub.resolves({ _id: 'userId', email: 'test@example.com' });

      const res = await request
        .execute(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com',
        });

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('User found');
    });
  });
});
