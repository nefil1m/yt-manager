app.controller('modalCtrl', ['$scope', '$modalInstance',
  function($scope, $modalInstance) {
    $scope.newPlaylist = {};

    $scope.dismiss = function() {
      $modalInstance.dismiss('dismissed');
    };

    $scope.create = function() {
      $modalInstance.close($scope.newPlaylist);
    };

  }]);