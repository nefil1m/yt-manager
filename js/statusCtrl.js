app.controller('statusCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.$watch(function() { return channelData }, function() {
        $scope.data = channelData;
    }, true);
}]);