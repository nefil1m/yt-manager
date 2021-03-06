angular.module('YTPlaylistManager')
.service('channel', ['$rootScope', function($rootScope) {
  var channel = {
    basic: {
      title: 'Stranger',
      authorized: false
    },
    options: {
      "maxResults": 24,
      "position": "last",
      "rememberMe": false,
      "autoplay": false,
      "topSection": "big",
      "defaultLayout": "grid"
    }
  };

  return channel;
}]);