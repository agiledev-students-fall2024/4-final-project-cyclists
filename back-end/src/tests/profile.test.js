import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../app.js';
import Profile from '../models/profile.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Profile API Tests', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Profile.deleteMany();
  });

  it('should create a new profile', (done) => {
    const newProfile = { name: 'John Doe', email: 'john@example.com', bio: 'Software Engineer' };

    chai
      .request(app)
      .post('/api/profiles')
      .send(newProfile)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name', 'John Doe');
        done();
      });
  });

  it('should fetch all profiles', (done) => {
    const profiles = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];

    Profile.insertMany(profiles).then(() => {
      chai
        .request(app)
        .get('/api/profiles')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array').that.has.lengthOf(2);
          done();
        });
    });
  });
});
