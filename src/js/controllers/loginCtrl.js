angular.module('YTPlaylistManager')
.controller('loginCtrl', ['$rootScope', '$scope', 'channel', '$location', 'YTResourceProvider',
  function($rootScope, $scope, channel, $location, YTResourceProvider) {
    $scope.checkAuth = function() {
      YTResourceProvider.auth()
      .then(function(response) {
        var res = response.result.items[0];
console.log('auth')
        $rootScope.authorized = true;
        channel.basic = {
          authorized: true,
          title: res.snippet.title,
          id: res.id,
          thumbnail: res.snippet.thumbnails.high.url
        };

        $scope.$parent.success('success', 'logged');
        $rootScope.$emit('logged');

        if( $location.url() === '/login') $location.url('/playlists');
      }, function(response) {
        $scope.$parent.error('error', response.error);
      });
    };
  }]);
