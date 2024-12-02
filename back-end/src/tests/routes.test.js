import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import fs from 'fs/promises';
import path from 'path';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Routes Tests', () => {
  let fsReadStub;
  let fsWriteStub;
  let fsMkdirStub;
  let pathJoinStub;
  const testFilePath = '/mock/path/routes.json';

  const mockRoutes = {
    routes: [
      {
        id: '1',
        name: 'Test Route 1',
        start_location: 'Start 1',
        end_location: 'End 1',
        date: '2024-03-08T10:00:00.000Z',
      },
      {
        id: '2',
        name: 'Test Route 2',
        start_location: 'Start 2',
        end_location: 'End 2',
        date: '2024-03-08T11:00:00.000Z',
      },
    ],
  };

  before(() => {
    fsReadStub = sinon.stub(fs, 'readFile');
    fsWriteStub = sinon.stub(fs, 'writeFile');
    fsMkdirStub = sinon.stub(fs, 'mkdir');
    pathJoinStub = sinon.stub(path, 'join').returns(testFilePath);

    fsReadStub.resolves(JSON.stringify(mockRoutes));
    fsWriteStub.resolves();
    fsMkdirStub.resolves();
  });

  after(() => {
    sinon.restore();
  });

  describe('GET /api/routes', () => {
    it('should return all routes', (done) => {
      chai
        .request(app)
        .get('/api/routes')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
  });

  // Add other route-related tests here
});
