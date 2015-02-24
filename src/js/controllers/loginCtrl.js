app.controller('loginViewCtrl', ['$rootScope', '$scope', 'channel', '$location', function($rootScope, $scope, channel, $location) {
    $scope.checkAuth = function() {
        $scope.$parent.auth();
    };
}]);