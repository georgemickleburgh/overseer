angular.module('OverseerApp', [
    'ngRoute',
    'overseer.controllers',
    'overseer.services',
    'overseer.filters',
    'overseer.directives'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'templates/home.html', controller: 'HomeCtrl'});
}]);