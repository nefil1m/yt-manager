app.controller('searchCtrl', ['$scope', 'channel', 'Video', function($scope, channel, Video) {
  $scope.options = {
    autoplay: false,
    defaultLayout: 'grid'
  };

  $scope.search = function(keywords) {
    if( $scope.keywords != keywords || angular.isUndefined($scope.keywords) ) {
      $scope.keywords = keywords;
      $scope.videos = [];
    }

    var options = {
      q: keywords,
      part: 'snippet',
      maxResults: channel.options.maxResults
    };

    var request = gapi.client.youtube.search.list(options);

    request.execute(function(response) {
      console.log(response);
      if( angular.isUndefined(response.error) ) {
        var res = response.result.items;
        $.each(res, function(i) {
          var video = new Video(res[i].id.videoId);
          video.get();

        });
      } else {
        $scope.$parent.error(response.error.message);
      }
    });
  };

  $(document).on('keyup', function(e) {
    if( e.which == 13 ) {
      $scope.search($scope.keywords);
    }
  });
}]);