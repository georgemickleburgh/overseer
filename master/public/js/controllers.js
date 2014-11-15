angular.module('overseer.controllers', ['overseer.services'])
    .controller('MainCtrl', ['$scope', 'overseer', function($scope, overseer) {

        $scope.click = function() {
            overseer.reloadServerList();
        };
    }])

    .controller('HomeCtrl', ['$scope', '$interval', 'overseer', function($scope, $interval, overseer) {
        $scope.servers = {};

        overseer.reloadServerList(function() {
            $scope.servers = overseer.getServers();
        });

        $interval(function() {
            $scope.servers = overseer.getServers();
        }, 1000);
    }]);