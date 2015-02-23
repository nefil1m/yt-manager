var app = angular.module('YTPlaylistManager', ['ngRoute', 'ngAnimate'])
                 .config(['$routeProvider', '$locationProvider', function($routeProvider,  $locationProvider) {
                    $routeProvider
                        .when('/', {
                            templateUrl: 'hello.html'
                        })
                        .when('/login', {
                            templateUrl: 'views/login.html',
                            controller: 'loginCtrl'
                        })
                        .otherwise({
                            redirectTo: '/'
                        });

                    $locationProvider.html5Mode(false);
}]);