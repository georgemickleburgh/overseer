angular.module('overseer.services', [])
    // Primary service, contains core methods
    .service('overseer', ['$http', '$interval', function($http, $interval) {
        var config = {};

        // Send a request back to the master server to check the server list
        var reloadServerList = function(callback) {
            $http.get('/get/serverlist')
                .success(function(data, status) {
                    if (status == 200) {
                        config.servers = data;
                        callback && callback();
                    }
                })
                .error(function(data, status) {
                    console.log(status);
                });
        };

        // Return the list of servers
        var getServers = function() {
            if (config.hasOwnProperty('servers')) {
                return config.servers;
            } else {
                reloadServerList();
                return false;
            }
        };

        // Get a single server's information
        var getServerInfo = function(serverId, callback) {
            var server = config.servers[serverId];

            if (!!server) {
                var url = 'http://' + server.host + ':' + server.port + '/get/all';
                $http.get(url)
                    .success(function(data) {
                        callback(serverId, data);
                    })
                    .error(function(data) {
                        callback(serverId, data);
                    });
            }
        };

        var getServerInfoCallback = function(serverId, info) {
            config.servers[serverId].info = info;
        };

        // Run a server reload every 3 seconds to check for updates
        $interval(function() {
            reloadServerList(function() {
                // Check if we have servers
                if (config.hasOwnProperty('servers')) {
                    // Loop through servers
                    for (var i = 0; i < config.servers.length; i++) {
                        // If the server is online, get its info
                        if (config.servers[i].online) {
                            getServerInfo(i, getServerInfoCallback);
                        }
                    }
                }
            });
        }, 3000);

        // Make methods publically available
        return {
            getServers: getServers,
            getServerInfo: getServerInfo,
            reloadServerList: reloadServerList
        };
    }]);