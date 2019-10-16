const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');

const app = express();
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port = process.env.Port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connected to a DB'))
.catch( (error) => console.error('Got an error', error));