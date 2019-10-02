const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    }
});
const Genre = mongoose.model('Genre', schema);

router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).send(`The genre with given id = ${req.params.id} not found`);
        }
        res.send(genre);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.put('/:id', async (req, res) => {

    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
        if (!genre) {
            return res.status(404).send(`The genre with given id = ${req.params.id} not found`);
        }
        res.send(genre);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.post('/', async (req, res) => {

    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) {
            return res.status(404).send(`The genre with given id = ${req.params.id} not found`);
        }
    
        res.send(genre);
    }
    catch (error) {
        return res.status(400).send(error);
    }
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
    };

    return Joi.validate(genre, schema);
}

module.exports = router;