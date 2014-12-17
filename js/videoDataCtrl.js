app.controller('videoDataCtrl', ['$scope', 'channel', function($scope, channel) {
    $scope.$watch(function() { return channel.activeVideo }, function() {
        $scope.video = channel.activeVideo;
    });
}]);
