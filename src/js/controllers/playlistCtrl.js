app.controller('playlistCtrl',['$rootScope', '$scope', 'channel', 'YTResourceProvider', '$modal', '$location',
  function($rootScope, $scope, channel, YTResourceProvider, $modal, $location) {
    $scope.options = channel.options;
    $scope.playlists = channel.playlists;

    $scope.get = function() {
      if( channel.basic.authorized && angular.isUndefined(channel.playlists) ) {
        var options = {
          channelId: channel.basic.id,
          maxResults: channel.options.maxResults,
          part: 'snippet,contentDetails'
        };

        if(angular.isDefined($scope.pageToken)) {
          options.pageToken = $scope.pageToken;
        }

        YTResourceProvider.getPlaylists(options)
          .then(function(response) {
            $scope.pageToken = response.result.nextPageToken;
            channel.playlists = response.result.items;
            $.each(channel.playlists, function(i) {
              channel.playlists[i].videos = [];
            });
            $scope.playlists = channel.playlists;
          }, function(response) {
            console.log(response.error);
          });
      } else {
        $scope.playlists = channel.playlists;
      }
    };

    var play = function(index) {
      channel.activePlaylist = channel.playlists[index];
      channel.player.loadVideoById(channel.activePlaylist.videos[0].id);
    };

    var getItems = function(index, callback) {
      var options = {
        playlistId: channel.playlists[index].id,
        part: 'snippet',
        maxResults: channel.options.maxResults
      };

      if( angular.isDefined($scope.pageToken) ) {
        options.pageToken = $scope.pageToken;
      }

      YTResourceProvider.getPlaylistItems(options)
        .then(function(response) {

          $scope.pageToken = response.nextPageToken;

          $.each(response.result.items, function(i) {

            YTResourceProvider.getVideo(response.result.items[i].snippet.resourceId.videoId)
              .then(function(response) {

                var video = angular.copy(response.result.items[0]);
                video.contentDetails.duration = $scope.$parent.translateDuration(video.contentDetails.duration);
                video.statistics.viewCount = $scope.$parent.addCommas(video.statistics.viewCount);

                channel.playlists[index].videos.push(video);

                if( channel.playlists[index].videos.length === channel.options.maxResults && angular.isDefined(callback) ) {
                  callback();
                }
              }, function(response) {
                console.log(response.error);
              });

          });

        }, function(response) {
          console.log(response.error);
        });
    };

    $scope.playPlaylist = function(index) {
      if( channel.playlists[index].videos.length != 0 ) {
        channel.player.loadVideoById(channel.playlists[index].videos[0].id);
        channel.activeVideo = index;
        play(index);
      } else {
        getItems(index, function() {
          play(index);
        });
      }
    };

    $scope.addPlaylist = function() {
      $scope.newPlaylist = {};

      var newPlaylistModal = $modal.open({
        templateUrl: 'views/modals/newPlaylistModal.html',
        size: 'lg',
        controller: 'modalCtrl',
        resolve: {
          playlist: function() {
            return $scope.newPlaylist;
          }
        }
      });

      newPlaylistModal.result.then(function(response) {
        var options = {
          part: 'snippet,status',
          resource: {
            snippet: {
              title: response.title,
              description: response.description,
              tags: response.tags
            },
            status: {
              privacyStatus: response.privacy
            }
          }
        };

        YTResourceProvider.newPlaylist(options)
          .then(function(response) {
            channel.playlists.unshift(response);
            $scope.$parent.success('Created "' + response.snippet.title + '"');
          }, function(response) {
            console.log(response);
            $scope.$parent.error("Error");
          });
      }, function(response) {
        console.log(response);
      });
    };

    $scope.openPlaylist = function(index) {
      getItems(index, function() {
        $location.url('/' + index + '/videos');
      });
    };

    $rootScope.$on('logged', $scope.get);
  }]);