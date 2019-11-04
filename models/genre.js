const Joi = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4
    }
});

const Genre = mongoose.model('Genre', schema);

function validateGenre(genre) {
    const schema = {
        name: Joi.string()
            .alphanum()
            .min(4)
            .max(50)
            .required()
    };

    return Joi.validate(genre, schema);
}

exports.genreSchema = schema;
exports.Genre = Genre;
exports.validate = validateGenre;