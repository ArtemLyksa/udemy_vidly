const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
const request = require('supertest');
let server;
let token;

describe('auth middleware', () => {
    beforeEach(() => { 
        token = new User().generateAuthToken();
        server = require('../../index'); 
    });
    afterEach(async () => { 
        await Genre.deleteMany({});
        await server.close();
    });

    const execute = function () {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    it('should return 401 if token is not provided', async () => {
        token = '';
        const res = await execute();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is not valid', async () => {
        token = 'a';
        const res = await execute();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await execute();
        expect(res.status).toBe(200);
    });

});