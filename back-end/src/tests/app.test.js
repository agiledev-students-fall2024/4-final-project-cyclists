import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('App Tests', () => {
  describe('CORS OPTIONS Request Handling', () => {
    it('should respond with 200 status for preflight requests', (done) => {
      chai
        .request(app)
        .options('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
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
    it('should log the error and return the correct status and message', (done) => {
      chai
        .request(app)
        .get('/error-route')
        .end((err, res) => {
          expect(consoleErrorStub.calledOnce).to.be.true;
          expect(consoleErrorStub.firstCall.args[0]).to.include('Error:');
          expect(res).to.have.status(500);
          expect(res.body)
            .to.have.property('error')
            .that.equals('Internal Server Error');
          done();
        });
    });
  });

  describe('GET / Route', () => {
    it('should respond with "Goodbye world!"', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Goodbye world!');
          done();
        });
    });
  });
});
