const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');

const app = express();
app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.Port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connected to a DB'))
.catch( (error) => console.error('Got an error', error));