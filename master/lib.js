var fs = require('fs'),
    jf = require('jsonfile'),
    request = require('request'),
    async = require('async'),
    configDir = getUserHome() + '/.overseer/',
    configFile = configDir + '/config.json',
    config = {};

// Create the config directory
fs.mkdir(configDir, function(err) {
    // Ignore the error if the folder already exists
    if (err && err.code !== 'EEXIST') {
        return false;
    } else {
        // Check if the config file exists
        if (fs.existsSync(configFile)) {
            // If it exists, set our config up
            config = jf.readFileSync(configFile);
        } else {
            // If it does not exists, create a blank config and fill it with the object
            config = {
                servers: [
                    { "name" : "localhost", "host" : "127.0.0.1", "port": "34746" }
                ]
            };
            jf.writeFileSync(configFile, config);
        }
    }
});

var masterLib = module.exports = {};

masterLib.checkServer = function(server, callback) {
    request('http://' + server.host + ':' + server.port + '/heartbeat', function(err, response, body) {
        if (!err && response.statusCode == 200) {
            server.online = true;
        } else {
            server.online = false;
        }

        callback(null, server);
    });
};

masterLib.updateServerListStatus = function(callback) {
    // Run an asynchronous map to check the server's status
    async.map(config.servers, masterLib.checkServer, function(err, result) {
        // Send the data to the callbacks if they exist
        if (!err) {
            callback && callback(result);
        } else {
            callback && callback(null);
        }
    });
};

masterLib.getServerList = function(callback) {
    // Read the file from configuration
    masterLib.updateServerListStatus(function(servers) {
        callback(servers);
    });
};

masterLib.addServer = function(server, callback) {
    // Add new server to list
    config.servers.push(server);

    // Write the new server to the config file
    jf.writeFile(configFile, config, function(err) {
        callback(err);
    });
};

function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}