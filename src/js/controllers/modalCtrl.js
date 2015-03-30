app.controller('modalCtrl', ['$scope', '$modalInstance', 'data',
  function($scope, $modalInstance, data) {
    if( angular.isDefined(data.playlist) ) {
      $scope.title = data.title;
      $scope.playlist = data.playlist;
    } else {
      $scope.title = data.title;
      $scope.playlist = {
        snippet: {},
        status: {},
        contentDetails: {
          itemCount: 0
        }
      };
    }

    $scope.dismiss = function() {
      $modalInstance.dismiss('dismissed');
    };

    $scope.create = function() {
      $modalInstance.close($scope.playlist);
    };

  }]);