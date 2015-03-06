app.controller('loginCtrl', ['$rootScope', '$scope', 'channel', '$location', 'OAuth', function($rootScope, $scope, channel, $location, OAuth) {
  $scope.checkAuth = function() {
    OAuth.auth()
    .then(function(response) {
      var res = response.result.items[0];

      $rootScope.authorized = true;
      channel.basic = {
        authorized: true,
        title: res.snippet.title,
        id: res.id,
        thumbnail: res.snippet.thumbnails.default.url
      };

      $scope.$parent.success('logged');

      if( $location.url() === '/login') $location.url('/playlists');
    }, function(response) {
      $scope.$parent.error(response.error);
    });
  };
}]);