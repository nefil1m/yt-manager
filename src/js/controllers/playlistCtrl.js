angular.module('YTPlaylistManager')
.controller('playlistCtrl', ['$rootScope', '$scope', 'channel', 'YTResourceProvider', '$modal', '$location',
  function($rootScope, $scope, channel, YTResourceProvider, $modal, $location) {
    $scope.options = channel.options;
    $scope.currentPage = 1;

    $scope.get = function() {
      if( channel.basic.authorized && angular.isUndefined(channel.playlists) ) {
        var options = {
          channelId: channel.basic.id,
          maxResults: channel.options.maxResults,
          part: 'snippet,contentDetails,status'
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
              if(channel.playlists[i].snippet.thumbnails.medium.url.indexOf('mqdefault') === -1) {
                channel.playlists[i].snippet.thumbnails.medium.url = 'img/noth.png';
              }
            });
            var from = $scope.options.maxResults * ($scope.currentPage - 1);
            $scope.filteredPlaylists = channel.playlists.slice(from, from + $scope.options.maxResults);
            $scope.totalItems = channel.playlists.length;
          }, function(response) {
            console.log(response.error);
          });
      } else {
        var from = $scope.options.maxResults * ($scope.currentPage - 1);
        $scope.filteredPlaylists = channel.playlists.slice(from, from + $scope.options.maxResults);
        $scope.totalItems = channel.playlists.length;
      }
    };

    var play = function(index) {
      channel.activePlaylist = channel.playlists[index];
      channel.player.loadVideoById(channel.activePlaylist.videos[0].id);
      channel.activeVideo = 0;
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

          var oneHundred = response.result.items.length,
              progress = 0,
              step = 100 / oneHundred;

          $.each(response.result.items, function(i) {

            YTResourceProvider.getVideo(response.result.items[i].snippet.resourceId.videoId)
              .then(function(response) {

                var video = angular.copy(response.result.items[0]);
                video.contentDetails.duration = $scope.$parent.translateDuration(video.contentDetails.duration);
                video.statistics.viewCount = $scope.$parent.addCommas(video.statistics.viewCount);

                progress += step;
                $scope.$parent.progress(progress.toFixed(2));

                channel.playlists[index].videos.push(video);

                if( (channel.playlists[index].videos.length === channel.options.maxResults ||
                     channel.playlists[index].videos.length === channel.playlists[index].contentDetails.itemCount ) &&
                     angular.isDefined(callback) ) {
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
      if( channel.playlists[index].videos.length ) {
        channel.player.loadVideoById(channel.playlists[index].videos[0].id);
        play(index);
      } else {
        getItems(index, function() {
          play(index);
        });
      }
    };

    $scope.addPlaylist = function() {
      var newPlaylistModal = $modal.open({
        templateUrl: 'views/modals/PlaylistModal.html',
        size: 'lg',
        controller: 'modalCtrl',
        resolve: {
          data: function() {
            return {
              title: "Create new playlist"
            }
          }
        }
      });

      newPlaylistModal.result.then(function(response) {
        var options = {
          part: 'snippet,status,contentDetails',
          resource: response
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

    $scope.editPlaylist = function(index) {
      var modal = $modal.open({
        templateUrl: 'views/modals/PlaylistModal.html',
        size: 'lg',
        controller: 'modalCtrl',
        resolve: {
          data: function() {
            return {
              title: 'Edit playlist "' + channel.playlists[index].snippet.title + '"',
              playlist: channel.playlists[index]
            }
          }
        }
      });

      modal.result.then(function(response) {
        var options = {
          id: channel.playlists[index].id,
          part: 'snippet,status',
          snippet: response.snippet,
          status: response.status
        }

        YTResourceProvider.editPlaylist(options)
          .then(function(response) {
            $scope.$parent.success('Successfuly updated "' + channel.playlists[index].snippet.title + '"');
          }, function(response) {
            console.log(response);
          });
      }, function(response) {
        console.log(response);
      });
    };

    $scope.deletePlaylist = function(index) {
      var options = {
        id: channel.playlists[index].id
      };

      YTResourceProvider.deletePlaylist(options)
        .then(function(response) {
          $scope.$parent.success('Successfuly deleted "' + channel.playlists[index].snippet.title + '"');
          channel.playlists.splice(index, 1);
        }, function(response) {
          console.log(response);
        });
    };

    $scope.openPlaylist = function(index) {
      getItems(index, function() {
        $location.url('/' + channel.playlists[index].id + '/videos');
      });
    };

    $scope.pageChanged = function() {
      $scope.filteredPlaylists = channel.playlists.slice(currentPage * $scope.options.maxResults, currentPage * $scope.options.maxResults + $scope.options.maxResults);
    }

    $rootScope.$on('logged', $scope.get);
  }]);