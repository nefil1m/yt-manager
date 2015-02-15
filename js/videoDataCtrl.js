app.controller('videoDataCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    $scope.$watch(function() { return channel.activeVideo }, function() {
        $scope.video = channel.activeVideo;
    });
    $rootScope.$on('updateData', function() {
        $scope.$apply(function() {
            $scope.video = channel.activeVideo;
        });
    });
}]);
