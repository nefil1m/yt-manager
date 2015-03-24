app.controller('playlistCtrl',['$rootScope', '$scope', 'channel', 'YTResourceProvider', '$modal',
  function($rootScope, $scope, channel, YTResourceProvider, $modal) {
    $scope.options = channel.options;
    $scope.playlists = channel.playlists;

    $scope.get = function() {
      if( angular.isUndefined(channel.playlists) ) {
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

    $scope.playPlaylist = function(index) {
      if( $scope.playlists[index].videos.lenght ) {
        channel.player.loadVideoById($scope.playlists[index].videos[0].id);
        channel.activePlaylist = $scope.playlists[index];
        channel.activeVideo = index;
      } else {
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
            $.each(response.result.items, function(i) {
              YTResourceProvider.getVideo(response.result.items[i].snippet.resourceId.videoId)
                .then(function(response) {
                  channel.activePlaylist = channel.playlists[index];
                  channel.activePlaylist.videos.push(response.result.items[0]);
                  channel.player.loadVideoById(channel.activePlaylist.videos[0].id);
                  channel.activeVideo = 0;
                }, function(response) {
                  console.log(response.error);
                });
            });
          }, function(response) {
            console.log(response.error);
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
            console.log(response);
            channel.playlists.unshift(response);
          }, function(response) {
            console.log(response);
          });
      }, function(response) {
        console.log(response);
      });
    };

    $rootScope.$on('logged', $scope.get);
  }]);