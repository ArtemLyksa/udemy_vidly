const Joi = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    }
});

const Genre = mongoose.model('Genre', schema);

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

exports.Genre = Genre;
exports.validate = validateGenre;