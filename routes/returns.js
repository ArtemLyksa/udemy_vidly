const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const moment = require('moment');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId is not provided');
    if (!req.body.movieId) return res.status(400).send('movieId is not provided');

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

module.exports = router;