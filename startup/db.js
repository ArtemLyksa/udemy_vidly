const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);

    mongoose.connect(db, { useUnifiedTopology: true })
    .then( () => winston.info(`Connnected to ${db}...`))
}
