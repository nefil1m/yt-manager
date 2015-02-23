app.controller('mainCtrl', ['$scope', 'channel', function($scope, channel) {

    $scope.channel = channel;

    $scope.$on('logged', function() {
        $scope.channel.basic = channel.basic;
        $scope.$apply();
    });
}]);