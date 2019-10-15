const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send(`The movie with given id = ${req.params.id} not found`);
        }
        res.send(movie);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
        if (!movie) {
            return res.status(404).send(`The movie with given id = ${req.params.id} not found`);
        }
        res.send(movie);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.post('/', async (req, res) => {

    var { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(404).send(`The genre with given id = ${req.body.genreId} not found`);
    }

    let movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) {
            return res.status(404).send(`The movie with given id = ${req.params.id} not found`);
        }
    
        res.send(movie);
    }
    catch (error) {
        return res.status(400).send(error);
    }
});

module.exports = router;