const { User, validate } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('generateAuthToken', () => {
    it('should generate valid token', () => {
        const paylaod = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(paylaod);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(paylaod);
    });
});