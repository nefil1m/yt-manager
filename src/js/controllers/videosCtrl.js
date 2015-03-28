app.controller('videosCtrl', ['$scope', 'channel', '$stateParams', '$location',
  function($scope, channel, $stateParams, $location) {
    $scope.options = channel.options;
    if( angular.isDefined(channel.playlists) ) {
      $scope.videos = channel.playlists[$stateParams.index].videos;
    } else {
      $location.url('/playlists');
    }
  }]);