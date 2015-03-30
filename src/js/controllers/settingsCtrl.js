app.controller('settingsCtrl', ['$scope', 'channel', 'localStorageService',
  function($scope, channel, localStorageService) {
    var options = localStorageService.get('options');
    $scope.options = {};

    // if( angular.isUndefined(options) ) {
      $scope.options = channel.options;
      $.each(options, function(key, value) {
        $scope.options[key] = options[key];
      });
    // } else {
      // $scope.options = channel.options;
      // $.extend($scope.options, options);
      // $scope.options = localStorageService.get('options');
    // }

    $scope.saveOptions = function() {
      channel.options = $scope.options;
      localStorageService.set('options', $scope.options);
      $scope.$parent.success('saved');
    };

  }]);