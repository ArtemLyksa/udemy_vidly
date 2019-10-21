module.exports = function(error, req, res, next) {
    //Log an exception
    console.log(error);
    res.status(500).send(error.message);
};