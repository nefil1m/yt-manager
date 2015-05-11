angular.module('YTPlaylistManager')
.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/hello")

    var routes = {};

    routes.app = {
      name: 'app',
      abstract: true,
      sticky: true,
      templateUrl: 'views/app.html',
      controller: 'mainCtrl',
      data: {
        requireLogin: true
      }
    };

    routes.hello = {
      name: 'hello',
      parent: 'app',
      url: '/hello',
      templateUrl: 'views/hello.html',
      data: {
        requireLogin: false
      }
    };

    routes.playlists = {
      name: 'playlists',
      parent: 'app',
      url: '/playlists',
      templateUrl: 'views/playlists.html',
      controller: 'playlistCtrl',
      data: {
        requireLogin: false
      }
    };

    routes.videos = {
      name: 'videos',
      parent: 'app',
      url: '/:id/videos',
      templateUrl: 'views/videos.html',
      controller: 'videosCtrl',
      data: {
        requireLogin: false
      }
    };

    routes.channel = {
      name: 'channel',
      parent: 'app',
      url: '/channel',
      templateUrl: 'views/channel.html',
      data: {
        requireLogin: true
      }
    };

    routes.settings = {
      name: 'settings',
      parent: 'app',
      url: '/settings',
      templateUrl: 'views/settings.html',
      controller: 'settingsCtrl',
      data: {
        requireLogin: true
      }
    };

    routes.login = {
      name: 'login',
      parent: 'app',
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'loginCtrl',
      data: {
        requireLogin: false
      }
    };

    routes.search = {
      name: 'search',
      parent: 'app',
      url: '/search',
      templateUrl: 'views/search.html',
      controller: 'searchCtrl',
      data: {
        requireLogin: false
      }
    };

    $.each(routes, function(i, route) {
      $stateProvider.state(route);
    });

}]);