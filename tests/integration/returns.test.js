const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');

let server;
let customerId;
let movieId;
let rental;
let token;

describe('/api/returns', () => {

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    it('should return 401 if user is not authorized', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for given customerId and movieId', async () => {
        await Rental.deleteMany({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async () => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
});