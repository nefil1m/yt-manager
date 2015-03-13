app.controller('searchCtrl', ['$scope', 'channel', 'YTResourceProvider', 'Video',
  function($scope, channel, YTResourceProvider, Video) {
    $scope.options = channel.options;

    var keywords;

    $scope.results = [];
    $scope.currentResults = [];
    $scope.currentPage = 0;
    $scope.numPerPage = channel.options.maxResults;

    $scope.search = function() {
      if( $scope.keywords != keywords || angular.isUndefined($scope.keywords) ) {
        $scope.results = [];
        $scope.nextPageToken = '';
        keywords = $scope.keywords;
      }

      var options = {
        q: keywords,
        part: 'snippet',
        maxResults: channel.options.maxResults
      };

      if( $scope.nextPageToken ) {
        options.pageToken = $scope.nextPageToken;
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
                console.log('error');
              });
          });

          $scope.totalItems = $scope.results.length;

          $('[data-toggle="tooltip"]').tooltip({
            viewport: 'body'
          });
        }, function(response) {
          $scope.$parent.error(response.error);
        });
    };

    $scope.playVideo = function(index) {
      channel.player.loadVideoById($scope.results[index].id);
      channel.activePlaylist = $scope.results;
      channel.activeVideo = index;
    };

    // $scope.$watch('currentPage + numPerPage', function() {
    //   var begin = (($scope.currentPage - 1) * $scope.numPerPage),
    //       end = begin + $scope.numPerPage;

    //   $scope.currentResults = $scope.results.slice(begin, end);
    // });

    $(document).on('keyup', function(e) {
      if( e.which == 13 ) {
        $scope.search($scope.keywords);
      }
    });
  }]);