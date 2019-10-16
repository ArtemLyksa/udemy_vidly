const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId); 
    if (!customer) {
        return res.status(404).send(`The customer with given id = ${req.body.customerId} not found`);
    }

    const movie = await Customer.findById(req.body.movieId); 
    if (!movie) {
        return res.status(404).send(`The movie with given id = ${req.body.movieId} not found`);
    }

    if (movie.numberInStock === 0) {
        return res.status(400).send('Movie not available');
    }

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: 
    })

    rental = await rental.save();
    res.send(rental);
});