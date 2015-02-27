app.controller('searchCtrl', ['$scope', function($scope) {
  $scope.options = {
    autoplay: false,
    defaultLayout: 'grid'
  };

  $scope.search = function() {
    console.log('saerch');
  };

  $(document).on('keyup', function(e) {
    if( e.which == 13 ) {
      $scope.search();
    }
  });
}]);