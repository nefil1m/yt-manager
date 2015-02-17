app.controller('searchCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    $scope.videos = [];
    $scope.token;

    $scope.$watch(function() { return channel.playlists }, function() {
        $scope.playlistsList = channel.playlists;
    }, true);

    $scope.search = function(keywords) {

        if( $scope.keywords != keywords || angular.isUndefined($scope.keywords) ) {
            $scope.keywords = keywords;
            $scope.videos = [];
        }

        var options = {
            q: keywords,
            part: 'snippet',
            maxResults: 21
        };

        if( angular.isDefined($scope.token) ) {
            options.pageToken = $scope.token;
        }

        var request = gapi.client.youtube.search.list(options);

        request.execute(function(response) {
            var res = response.result.items;

            if( angular.isUndefined(response.error) ) {
                $scope.token = response.result.nextPageToken;

                $.each(res, function(i) {
                    var video = {
                        id: res[i].id.videoId,
                        title: res[i].snippet.title,
                        description: res[i].snippet.description,
                        thumbnail: res[i].snippet.thumbnails.medium.url,
                        author: res[i].snippet.channelTitle,
                        publishedAt: res[i].snippet.publishedAt,
                        source: 'search'
                    };

                    $scope.$apply(function() {
                        $scope.videos.push(video);
                    });
                });
            } else {
                $rootScope.$emit('throwError', response.error);
            }
        });
    };

    $scope.playVideo = function(index) {
        channel.player.loadVideoById($scope.videos[index].id);

        var request = gapi.client.youtube.videos.list({
            id: $scope.videos[index].id,
            part: 'id,contentDetails,statistics'
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                var res = response.result.items[0],
                    item = $scope.videos[index];

                item.likes = res.statistics.likeCount;
                item.dislikes = res.statistics.dislikeCount;
                item.views = res.statistics.viewCount;
                item.duration = $rootScope.translateDuration(res.contentDetails.duration);

                if( angular.isDefined(channel.activeVideo) ) {
                    channel.activeVideo.selected = false;
                }

                channel.startNextVid = false;
                channel.activeVideo = item;
                channel.activeVideo.selected = true;
                channel.simplified.video = item.title;

                $rootScope.$emit('updateData');
            } else {
                $rootScope.$emit('throwError', response.error);
            }
        });
    };

    $scope.addToAnotherPl = function(index, playlistIndex) {
        var playlist = channel.playlists[playlistIndex],
            video = $scope.videos[index];

        var request = gapi.client.youtube.playlistItems.insert({
            part: 'snippet',
            snippet: {
                playlistId: playlist.id,
                resourceId: {
                    kind: 'youtube#video',
                    videoId: video.id
                }
            }
        });

        request.execute(function(response) {
            if( angular.isUndefined(response.error) ) {
                playlist.itemCount++;
                $rootScope.$emit('throwSuccess', 'Added ' + video.title + ' to ' + playlist.title);
            } else {
                $rootScope.$emit('throwError', response.error);
            }
        })
    };

    $scope.addVideo = function(index) {
        if( angular.isDefined(channel.activePlaylist) ) {
            var request = gapi.client.youtube.playlistItems.insert({
                part: 'snippet',
                snippet: {
                    playlistId: channel.activePlaylist.id,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: $scope.videos[index].id
                    }
                }
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    if( angular.isUndefined(channel.activePlaylist.videos) ) {
                        channel.activePlaylist.videos = [];
                    }
                    var video = angular.copy($scope.videos[index]);
                    video.source = 'playlist';

                    channel.activePlaylist.videos.push(video);
                    channel.activePlaylist.itemCount++;
                    $rootScope.$emit('applyVideo');
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        } else {
            $scope.addToAnotherPl(index);
        }
    };

    $('#searchInput').keyup(function(e) {
        if( e.which == 13 ) {
            $scope.search($scope.searchKeywords);
        }
    })
}]);