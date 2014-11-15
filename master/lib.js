var fs = require('fs'),
    jf = require('jsonfile'),
    request = require('request'),
    configFile = __dirname + '/../overseer.json',
    config = {};

// Check if the config file exists
if (fs.existsSync(configFile)) {
    // If it exists, set our config up
    config = jf.readFileSync(configFile);
} else {
    // If it does not exists, create a blank config and fill it with the object
    config = {
        servers: [
            { "name" : "localhost", "host" : "127.0.0.1" }
        ]
    };
    jf.writeFileSync(configFile, config);
}

var masterLib = module.exports = {};

masterLib.updateServerListStatus = function(callback) {
    var currentAction = 0;
    for (var i = 0; i < config.servers.length; i++) {
        (function(i, callback) {
            // Send a request to the heartbeat
            request('http://' + config.servers[i].host + ':' + config.servers[i].port + '/heartbeat', function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    config.servers[i].online = true;
                } else {
                    config.servers[i].online = false;
                }
                currentAction++;

                if (currentAction == config.servers.length - 1) {
                    callback && callback();
                }
            });
        })(i, callback);
    }
};

masterLib.getServerList = function(callback) {
    // Read the file from configuration
    masterLib.updateServerListStatus(function() {
        callback(config.servers);
    });
};

masterLib.addServer = function(server, callback) {
    config.servers.push(server);

    // Write the new server to the config file
    jf.writeFile(configFile, config, function(err) {
        callback(err);
    });
};