module.exports = function(error, req, res, next) {
    //Log an exception
    res.status(500).send('Something failed');
};