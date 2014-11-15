var express = require('express'),
    clientLib = require('./lib'),
    app = express(),
    port = 34746;

var client = module.exports = {};

/**
 * Start the client server off
 */
client.startServer = function() {
    // CORS Headers
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    // Routing for /get/:stat
    app.get('/get/:stat', function(req, res) {
        var stat = req.params.stat;

        clientLib.get(stat, function(info) {
            res.send(info);
        });
    });

    app.get('/heartbeat', function(req, res) {
        res.send({online: true});
    });

    // Start the app server
    var server = app.listen(port, function () {
        console.log('Started overseer client server on port ' + port);
    });
};