app.controller('modalCtrl', ['$scope', '$modalInstance', 'playlist', 'YTResourceProvider', 'channel',
  function($scope, $modalInstance, playlist, YTResourceProvider, channel) {
    $scope.newPlaylist = {};

    $scope.dismiss = function() {
      $modalInstance.dismiss('dismissed');
    };

    $scope.create = function() {
      $modalInstance.close($scope.newPlaylist);
    };

  }]);