angular.module('YTPlaylistManager')
.controller('playlistCtrl', ['$rootScope', '$scope', 'channel', 'YTResourceProvider', '$modal', '$location', '$q',
  function($rootScope, $scope, channel, YTResourceProvider, $modal, $location, $q) {
    $scope.options = channel.options;
    $scope.currentPage = 1;
    var progress = 0;

    $scope.init = function() {
      if( channel.basic.authorized && angular.isUndefined(channel.playlists) ) {
        $scope.get();
       } else if(channel.basic.authorized) {
        var from = $scope.options.maxResults * ($scope.currentPage - 1);
        $scope.filteredPlaylists = channel.playlists.slice(from, from + $scope.options.maxResults);
        $scope.totalItems = channel.playlists.length;
      }
    }

    $scope.get = function() {
      var options = {
        channelId: channel.basic.id,
        maxResults: channel.options.maxResults,
        part: 'snippet,contentDetails,status'
      };

      if(angular.isDefined($scope.pageToken)) {
        options.pageToken = $scope.pageToken;
      }

      YTResourceProvider.sendRequest(options, 'playlists.list')
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
          $scope.$parent.error("Error");
        });
    };

    var play = function(index) {
      channel.activePlaylist = channel.playlists[index];
      channel.player.loadVideoById(channel.activePlaylist.videos[0].id);
      channel.activeVideo = 0;
    };

    var getItemsRecursively = function(itemsCollection, i, playlist, callback) {
      var oneHundred = itemsCollection.length;
      var step = 100 / oneHundred;

      if(angular.isDefined(itemsCollection[i])) {
        var options = {
          id: itemsCollection[i].snippet.resourceId.videoId,
          part: 'snippet,contentDetails,statistics'
        };

        YTResourceProvider.sendRequest(options, 'videos.list')
          .then(function(response) {
            if(response.result.items.length) {
              var video = angular.copy(response.result.items[0]);
              video.playlistItemId = itemsCollection[i].id;
              video.contentDetails.duration = $scope.$parent.translateDuration(video.contentDetails.duration);
              video.statistics.viewCount = $scope.$parent.addCommas(video.statistics.viewCount);

              playlist.videos.push(video);

              if( (playlist.videos.length === channel.options.maxResults ||
                   playlist.videos.length === playlist.contentDetails.itemCount ) &&
                   angular.isDefined(callback) ) {
                callback();
              }

              var getRatingOptions = {
                id: video.id
              };

              YTResourceProvider.sendRequest(options, 'videos.getRating')
                .then(function(response) {
                  video.rating = response.result.items[0].rating;
                }, function(response) {
                  console.log(response);
                });
            }

            progress += step;
            $scope.$parent.progress(progress.toFixed(2));
            getItemsRecursively(itemsCollection, i + 1, playlist, callback);
          }, function(response) {
            console.log(response);
            getItemsRecursively(itemsCollection, i, playlist, callback);
            progress = 0;
          });
      }
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

      YTResourceProvider.sendRequest(options, 'playlistItems.list')
        .then(function(response) {

          $scope.pageToken = response.nextPageToken;

          getItemsRecursively(response.result.items, 0, channel.playlists[index], callback);
        }, function(response) {
          console.log(response.error);
          $scope.$parent.error("Error");
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
              title: "Create new playlist",
              buttonText: 'Create'
            }
          }
        }
      });

      newPlaylistModal.result.then(function(response) {
        var options = {
          part: 'snippet,status,contentDetails',
          resource: response
        };

        YTResourceProvider.sendRequest(options, 'playlists.insert')
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
              playlist: channel.playlists[index],
              buttonText: 'Save'
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

        YTResourceProvider.sendRequest(options, 'playlists.update')
          .then(function(response) {
            $scope.$parent.success('Successfuly updated "' + channel.playlists[index].snippet.title + '"');
          }, function(response) {
            console.log(response);
            $scope.$parent.error("Error");
          });
      });
    };

    $scope.deletePlaylist = function(index) {
      var options = {
        id: channel.playlists[index].id
      };

      YTResourceProvider.sendRequest(options, 'playlists.delete')
        .then(function(response) {
          $scope.$parent.success('Successfuly deleted "' + channel.playlists[index].snippet.title + '"');
          channel.playlists.splice(index, 1);
        }, function(response) {
          console.log(response);
          $scope.$parent.error("Error");
        });
    };

    $scope.openPlaylist = function(index) {
      getItems(index, function() {
        $location.url('/' + channel.playlists[index].id + '/videos');
      });

      $rootScope.openedPlaylist = channel.playlists[index];
    };

    $scope.pageChanged = function() {
      $scope.filteredPlaylists = channel.playlists.slice(currentPage * $scope.options.maxResults, currentPage * $scope.options.maxResults + $scope.options.maxResults);
    };

    $scope.setPlaylist = function(which) {
      getItems($scope['playlist' + which]);

      if(which === 1) {
        $scope.playlistLeft = channel.playlists[$scope['playlist' + which]];
      } else {
        $scope.playlistRight = channel.playlists[$scope['playlist' + which]];
      }
    };

    $rootScope.$on('logged', $scope.get);
  }]);