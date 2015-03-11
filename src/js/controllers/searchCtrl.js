app.controller('searchCtrl', ['$scope', 'channel', 'YTResourceProvider', 'Video',
  function($scope, channel, YTResourceProvider, Video) {
    $scope.options = {
      autoplay: false,
      defaultLayout: 'grid'
    };

    $scope.results = [];

    $scope.search = function(keywords) {
      if( $scope.keywords != keywords || angular.isUndefined($scope.keywords) ) {
        $scope.keywords = keywords;
        $scope.results = [];
        $scope.nextPageToken = '';
      }

      var options = {
        q: keywords,
        part: 'snippet',
        maxResults: channel.options.maxResults
      };

      if( $scope.nextPageToken != '' ) {
        options.nextPageToken = $scope.nextPageToken;
      }

      YTResourceProvider.search(options)
        .then(function(response) {
          var res = response.result.items;
          var tempResults = [];
          $scope.nextPageToken = response.nextPageToken;

          $.each(res, function(i) {
            YTResourceProvider.getVideo(res[i].id.videoId)
              .then(function(response) {
                var res = response.result.items[0];
                var video = {
                  id: res.id,
                  snippet: angular.copy(res.snippet),
                  contentDetails: angular.copy(res.contentDetails),
                  statistics: angular.copy(res.statistics)
                };

                video.contentDetails.duration = $scope.$parent.translateDuration(video.contentDetails.duration);
                video.statistics.viewCount = $scope.$parent.addCommas(video.statistics.viewCount);

                $scope.results.push(video);
              }, function() {
                console.log('error')
              });
          });

          $('[data-toggle="tooltip"]').tooltip({
            viewport: 'body'
          });
        }, function(response) {
          $scope.$parent.error(response.error);
        });
    };

    $(document).on('keyup', function(e) {
      if( e.which == 13 ) {
        $scope.search($scope.keywords);
      }
    });
  }]);