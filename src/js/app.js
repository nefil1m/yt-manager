var app = angular.module('YTPlaylistManager', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngCookies'])
         .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise("index")

          $stateProvider
            .state('index', {
              url: '/',
              templateUrl: 'hello.html',
              data: {
                requireLogin: false
              }
            })
            .state('login', {
              url: '/login',
              templateUrl: 'views/login.html',
              controller: 'loginViewCtrl',
              data: {
                requireLogin: false
              }
            })
            .state('channel', {
              url: '/channel',
              templateUrl: 'views/channel.html',
              data: {
                requireLogin: true
              }
            })
            .state('playlists', {
              url: '/playlists',
              templateUrl: 'views/playlists.html',
              data: {
                requireLogin: false
              }
            })
            .state('videos', {
              url: '/videos',
              templateUrl: 'views/videos.html',
              data: {
                requireLogin: false
              }
            })
            .state('settings', {
              url: '/settings',
              templateUrl: 'views/settings.html',
              controller: 'settingsCtrl',
              data: {
                requireLogin: true
              }
            })
            .state('compare', {
              url: '/compare',
              templateUrl: 'views/compare.html',
              data: {
                requireLogin: true
              }
            })
            .state('search', {
              url: '/search',
              templateUrl: 'views/search.html',
              controller: 'searchCtrl',
              data: {
                requireLogin: false
              }
            });
}]).run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if( requireLogin && angular.isUndefined($rootScope.authorized) ) {
      event.preventDefault();
    }
  });
}]);