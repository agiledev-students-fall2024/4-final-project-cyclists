const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const app = require('../app'); // Assuming app.js is your main application file
const incidentsPath = path.join(__dirname, '../data/incidents.json');

chai.use(chaiHttp);
const { expect } = chai;

describe('Incident Controller', () => {
    before(() => {
        // Setup: Clear the incidents.json file before tests
        fs.writeFileSync(incidentsPath, JSON.stringify([])); // Clear data
    });

    describe('POST /api/incidents', () => {
        it('should report a new incident successfully', (done) => {
            chai.request(app)
                .post('/api/incidents')
                .send({
                    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
                    caption: 'Incident test caption',
                    longitude: -73.9857,
                    latitude: 40.7484,
                    date: '2024-04-28T09:15:30Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Incident reported successfully');
                    expect(res.body.incident).to.have.property('id');
                    expect(res.body.incident).to.have.property('caption', 'Incident test caption');
                    done();
                });
        });

        it('should return an error if any field is missing', (done) => {
            chai.request(app)
                .post('/api/incidents')
                .send({
                    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
                    caption: '', // Empty caption
                    longitude: -73.9857,
                    latitude: 40.7484,
                    date: '2024-04-28T09:15:30Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'All fields are required.');
                    done();
                });
        });
    });

    describe('GET /api/incidents', () => {
        it('should retrieve all reported incidents', (done) => {
            chai.request(app)
                .get('/api/incidents')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.at.least(1); // Should contain the previously added incident
                    done();
                });
        });

        it('should retrieve a single incident by ID', (done) => {
            chai.request(app)
                .get('/api/incidents/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id', 1);
                    done();
                });
        });

        it('should return an error if the incident ID is invalid', (done) => {
            chai.request(app)
                .get('/api/incidents/9999') // Invalid ID
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Incident not found');
                    done();
                });
        });
    });

    describe('DELETE /api/incidents', () => {
        it('should delete an incident by ID', (done) => {
            chai.request(app)
                .delete('/api/incidents/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Incident deleted successfully');
                    done();
                });
        });

        it('should return an error if the incident ID is invalid', (done) => {
            chai.request(app)
                .delete('/api/incidents/9999') // Invalid ID
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'Incident not found');
                    done();
                });
        });
    });
});
