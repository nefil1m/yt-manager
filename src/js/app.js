var app = angular.module('YTPlaylistManager', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngCookies'])
                 .config(['$routeProvider', '$locationProvider', function($routeProvider,  $locationProvider) {
                    $routeProvider
                        .when('/', {
                            templateUrl: 'hello.html'
                        })
                        .when('/login', {
                            templateUrl: 'views/login.html',
                            controller: 'loginCtrl'
                        })
                        .when('/channel', {
                            templateUrl: 'views/channel.html'
                        })
                        .when('/playlists', {
                            templateUrl: 'views/playlists.html'
                        })
                        .when('/videos', {
                            templateUrl: 'views/videos.html'
                        })
                        .when('/settings', {
                            templateUrl: 'views/settings.html',
                            controller: 'settingsCtrl'
                        })
                        .when('/compare', {
                            templateUrl: 'views/compare.html'
                        })
                        .otherwise({
                            redirectTo: '/'
                        });

                    $locationProvider.html5Mode(false);
}]);