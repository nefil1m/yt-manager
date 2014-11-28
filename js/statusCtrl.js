app.controller('statusCtrl', ['$scope', 'channelData', function($scope, channelData) {
    $scope.$watch(function() { return channelData.simplified }, function() {
        $scope.data = channelData.simplified;
        console.log(channelData.simplified);
    }, true);

    $scope.play = function() {
        channelData.playState = 'playing';
    };
}]);