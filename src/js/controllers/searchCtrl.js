angular.module('YTPlaylistManager')
.controller('searchCtrl', ['$scope', 'channel', 'YTResourceProvider',
  function($scope, channel, YTResourceProvider) {
    $scope.options = channel.options;

    var keywords;

    $scope.results = [];
    $scope.currentResults = [];
    $scope.currentPage = 1;

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

      YTResourceProvider.sendRequest(options, 'search.list')
        .then(function(response) {
          var res = response.result.items;
          var tempResults = [];
          $scope.nextPageToken = response.nextPageToken;

          $.each(res, function(i) {
            var options = {
              id: res[i].id.videoId,
              part: 'snippet,contentDetails,statistics'
            };

            YTResourceProvider.sendRequest(options, 'videos.list')
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

                var from = $scope.options.maxResults * ($scope.currentPage - 1);
                $scope.filteredResults = $scope.results.slice(from, from + $scope.options.maxResults);
                $scope.totalItems = $scope.results.length;

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

    $scope.pageChanged = function() {
      var from = $scope.options.maxResults * ($scope.currentPage - 1);
      $scope.filteredResults = $scope.results.slice(from, from + $scope.options.maxResults);
    };

    $(document).on('keyup', function(e) {
      if( e.which == 13 ) {
        $scope.search($scope.keywords);
      }
    });
  }]);