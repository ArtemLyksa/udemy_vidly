const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { Rental } = require('../models/rental');

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
    await rental.save();
    res.status(200).send();
});

module.exports = router;