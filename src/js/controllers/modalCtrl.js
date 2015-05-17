angular.module('YTPlaylistManager')
.controller('modalCtrl', ['$scope', '$modalInstance', 'data',
  function($scope, $modalInstance, data) {
    if( angular.isDefined(data.playlist) ) {
      $scope.playlist = data.playlist;
    } else {
      $scope.playlist = {
        snippet: {},
        status: {},
        contentDetails: {
          itemCount: 0
        }
      };
    }

    $scope.title = data.title;
    $scope.buttonText = data.buttonText;

    $scope.dismiss = function() {
      $modalInstance.dismiss('dismissed');
    };

    $scope.create = function() {
      $modalInstance.close($scope.playlist);
    };

  }]);