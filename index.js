const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');
require('winston-mongodb');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');
const error = require('./middleware/error');

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ 
    db: 'mongodb://localhost/vidly',
    level: 'error'
}));

winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

process.on('unhandledRejection', (err) => {
    throw(err);
});

const p = Promise.reject( new Error('unhandled rejection'));
p.then(() => console.log('Done'));

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.Port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connected to a DB'))
.catch( (error) => console.error('Got an error', error));