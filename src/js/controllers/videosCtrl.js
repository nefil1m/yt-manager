app.controller('videosCtrl', ['$scope', 'channel', '$stateParams',
  function($scope, channel, $stateParams) {
    $scope.options = channel.options;
    $scope.videos = channel.playlists[$stateParams.index].videos;
  }]);