app.controller('settingsCtrl', ['$scope', 'channel', '$cookies', '$cookieStore', function($scope, channel, $cookies, $cookieStore) {
    var options = $cookieStore.get('options');

    if( angular.isUndefined(options) ) {
        $scope.options = channel.options;
    } else {
        $scope.options = $cookieStore.get('options');
    }

    $scope.saveOptions = function() {
        channel.options = $scope.options;
        $cookieStore.put('options', $scope.options);
    };

}]);