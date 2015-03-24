app.controller('settingsCtrl', ['$scope', 'channel', 'localStorageService',
  function($scope, channel, localStorageService) {
    var options = localStorageService.get('options');

    if( angular.isUndefined(options) ) {
      $scope.options = channel.options;
    } else {
      $scope.options = localStorageService.get('options');
    }

    $scope.saveOptions = function() {
      channel.options = $scope.options;
      localStorageService.set('options', $scope.options);
      $scope.$parent.success('saved');
    };

  }]);