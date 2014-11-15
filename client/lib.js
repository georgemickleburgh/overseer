var osStats = require('./osStats');

var clientLib = module.exports = {};

clientLib.get = function(stat, callback) {
    // Check if we need all, or a specific stat
    if (stat == 'all') {
        // Run osStats
        osStats(function(stats) {
            // Send it all back to the callback
            callback(stats);
        });
    } else {
        // Run the osStats method
        osStats(function(stats) {
            // Check we have the stat and return it
            if (stats.hasOwnProperty(stat)) {
                callback(stats[stat]);
            } else {
                callback(false);
            }
        });
    }
};