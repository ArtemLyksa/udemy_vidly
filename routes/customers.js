const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

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

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);
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

router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    await customer.save();

    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {

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

module.exports = router;