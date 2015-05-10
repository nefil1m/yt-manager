app.controller('videosCtrl', ['$scope', 'channel', '$stateParams', '$location',
  function($scope, channel, $stateParams, $location) {
    $scope.options = channel.options;
    if( angular.isDefined(channel.playlists) ) {
      for(var i in channel.playlists) {
        if(channel.playlists[i].id === $stateParams.id) {
          $scope.videos = channel.playlists[i].videos;
        }
      }
    } else {
      $location.url('/playlists');
    }
  }]);