import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app, { connectToDatabase } from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== App Tests =====', () => {
  let databaseStub, consoleErrorStub;

  before(() => {
    // Mock mongoose.connect to avoid making actual database calls during test
    databaseStub = sinon.stub(mongoose, 'connect').resolves();
    // Mock console.error to prevent actual error logs and capture them for testing
    consoleErrorStub = sinon.stub(console, 'error');
  });

  after(() => {
    // Restore the original behavior of mongoose.connect and console.error after tests
    databaseStub.restore();
    consoleErrorStub.restore();
  });

  describe('Database Connection', () => {
    it('should call mongoose.connect with the correct URI', async () => {
      await connectToDatabase();

      expect(databaseStub.calledOnceWith(process.env.MONGODB_URI)).to.be.true;
    });
    it('should log an eror if mongoose.connect fails', async () => {
      databaseStub.rejects(new Error('Connection failed'));

      await connectToDatabase();

      expect(
        consoleErrorStub.calledWith(
          'Error connecting to MongoDB:',
          sinon.match.instanceOf(Error)
        )
      ).to.be.true;
    });
  });

  describe('Route Handling', () => {
    describe('CORS OPTIONS Request Handling', () => {
      it('should include the correct CORS headers', async () => {
        const res = await request.execute(app).options('/');

        expect(res).to.have.status(200);
        expect(res.headers['access-control-allow-origin']).to.equal(
          'http://localhost:3000'
        );
        expect(res.headers['access-control-allow-methods']).to.equal(
          'GET, POST, PUT, DELETE, OPTIONS'
        );
      });
    });

    describe('GET / Route', () => {
      it('should return "Goodbye World!"', async () => {
        const res = await request.execute(app).get('/');

        expect(res).to.have.status(200);
        expect(res.text).to.equal('Goodbye World!');
      });
    });

    describe('Nonexistent Route and Error Handling Middleware', () => {
      it('should return 404 for nonexistent route', async () => {
        const res = await request.execute(app).get('/nonexistent');

        expect(res).to.have.status(404);
      });

      it('should handle errors and return a consistent error response', async () => {
        const res = await request.execute(app).get('/error-route');

        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error', 'Internal Server Error');
      });
    });
  });
});
