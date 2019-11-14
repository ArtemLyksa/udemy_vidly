const Joi = require('joi');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = express.Router();
const moment = require('moment');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });

    if (!rental) res.status(404).send('rental not found');

    if (rental.dateReturned) res.status(400).send('rental already processed');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;