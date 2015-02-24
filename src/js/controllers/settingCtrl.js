app.controller('settingsCtrl', ['$scope', 'channel', '$cookies', '$cookieStore', function($scope, channel, $cookies, $cookieStore) {

    if( angular.isUndefined($cookies.options) ) {
        $scope.options = channel.options;
    } else {
        $scope.options = $cookieStore.get('options');
        console.log($scope.options);
    }

    $scope.saveOptions = function() {
        channel.options = $scope.options;
        $cookieStore.put('options', $scope.options);
    };

}]);