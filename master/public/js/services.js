angular.module('overseer.services', [])
    .service('overseer', ['$http', '$interval', function($http, $interval) {
        var config = {};

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

        var getServers = function() {
            if (config.hasOwnProperty('servers')) {
                return config.servers;
            } else {
                reloadServerList();
                return false;
            }
        };

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

        return {
            getServers: getServers,
            getServerInfo: getServerInfo,
            reloadServerList: reloadServerList
        };
    }]);