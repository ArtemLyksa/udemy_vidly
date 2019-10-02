const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const schema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    },
});
const Customer = mongoose.model('Customer', schema);

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send(`The customer with given id = ${req.params.id} not found`);
        }
        res.send(customer);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.put('/:id', async (req, res) => {

    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, { 
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        }, { new: true })
        if (!customer) {
            return res.status(404).send(`The customer with given id = ${req.params.id} not found`);
        }
        res.send(customer);
    }
    catch (error) {
        return res.status(400).send(error);
    }

});

router.post('/', async (req, res) => {

    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    customer = await customer.save();

    res.send(customer);
});

router.delete('/:id', async (req, res) => {

    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) {
            return res.status(404).send(`The customer with given id = ${req.params.id} not found`);
        }

        res.send(customer);
    }
    catch (error) {
        return res.status(400).send(error);
    }
});

function validateCustomer(customer) {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(customer, schema);
}

module.exports = router;