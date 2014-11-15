angular.module('overseer.directives', [])
    .directive('spinner', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: false,
            templateUrl: 'templates/partials/spinner.html'
        };
    })

    .directive('bar', function() {
        var linkFunction = function(scope, elem, attr) {
            scope.total = attr.total;
            scope.fill  = attr.fill;

            scope.getStyle = function() {
                var color = '#ecf0f1';

                return 'width: ' + ((scope.fill / scope.total) * 100) + '%;' +
                    'background: ' + color;
            };
        };

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/partials/bar.html',
            link: linkFunction
        };
    });