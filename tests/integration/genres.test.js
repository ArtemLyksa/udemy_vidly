const request = require('supertest');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(response.body.some(genre => genre.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre with given id', async () => {
            const result = await Genre.collection.insertOne({ name: 'genre1' });
            const id = result.insertedId.toHexString();
            const response = await request(server).get(`/api/genres/${id}`);
            expect(response.status).toBe(200);
            expect(response.body._id).toBe(id);
        });

        it('should return 404 if genre with given id not found', async () => {
            const id = new mongoose.Types.ObjectId().toHexString();
            const response = await request(server).get(`/api/genres/${id}`);
            expect(response.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        const execute = async function () {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await execute();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less then 4 chars', async () => {
            name = '123';
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more then 50 chars', async () => {
            name = new Array(52).join('a');
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await execute();
            const genre = await Genre.findOne({ name: name });
            expect(genre).not.toBeNull();
        });

        it('should have the genre in the response body', async () => {
            const res = await execute();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

});