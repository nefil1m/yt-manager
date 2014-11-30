app.controller('videoDataCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.$watch(function() { return channelData.activeVideo }, function() {
        $scope.video = channelData.activeVideo;
    });
}]);