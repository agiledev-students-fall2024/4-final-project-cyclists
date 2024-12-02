import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('User Profile API', () => {
  it('should save profile data successfully', (done) => {
    chai
      .request(app)
      .post('/api/users/12345/profile')
      .send({ name: 'John Doe', email: 'johndoe@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Profile saved successfully');
        done();
      });
  });

  it('should return error for missing required fields', (done) => {
    chai
      .request(app)
      .post('/api/users/12345/profile')
      .send({ name: 'John Doe' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'Missing required fields: name or email');
        done();
      });
  });
});
