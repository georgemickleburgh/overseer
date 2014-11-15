var express = require('express'),
    bodyParser = require('body-parser'),
    masterLib = require('./lib'),
    app = express(),
    port = 34747,
    updateInterval = 3000;

var master = module.exports = {};

/**
 * Start the client server off
 */
master.startServer = function() {
    // Setup express settings
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

    app.get('/get/:object', function(req, res) {
        var object = req.params.object;

        switch(object) {
            case 'serverlist': masterLib.getServerList(function(serverList) {
                res.send(serverList);
            }); break;
            default: break;
        }
    });

    app.post('/add/:object', function(req, res) {
        var object = req.params.object;
        var body = req.body;

        switch(object) {
            case 'server':
                masterLib.addServer(body.server, function(err) {
                    if (err) {
                        res.send('error');
                    } else {
                        res.send('success');
                    }
                })
        }
    });

    // Start the app server
    var server = app.listen(port, function () {
        console.log('Started overseer master server on port ' + port);
    });

    // Start the update interval
    setInterval(function() {
        masterLib.updateServerListStatus();
    }, updateInterval);
};