const { User, validate } = require('../models/user');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (ex) {
        return res.status(500).send(ex.errmsg);
    }

});

module.exports = router;