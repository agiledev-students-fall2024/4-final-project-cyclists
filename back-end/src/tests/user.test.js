import * as chai from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('===== User Controller Tests =====', () => {
  it('should save profile data successfully', async () => {
    const res = await request
      .execute(app)
      .post('/api/users/12345/profile')
      .send({ name: 'John Doe', email: 'johndoe@example.com' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Profile saved successfully');
  });

  it('should return error for missing required fields', async () => {
    const res = await request
      .execute(app)
      .post('/api/users/12345/profile')
      .send({ name: 'John Doe' });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property(
      'message',
      'Missing required fields: name or email'
    );
  });
});
