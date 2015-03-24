app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")

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
        controller: 'loginCtrl',
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
}])