app.controller('videoCtrl', ['$scope', 'channelData', function($scope, channelData) {

    $scope.getVideos = function() {
        var options = {
            playlistId: channelData.activePlaylist.id,
            part: 'snippet',
            maxResults: 10
        };

        if( angular.isDefined(channelData.nextVideosToken) ) {
            options.pageToken = channelData.nextVideosToken;
        }

        var request = gapi.client.youtube.playlistItems.list(options);

        request.execute(function(response) {
            channelData.nextVideosToken = response.result.nextPageToken;

            if( angular.isUndefined(response.error) ) {
                var res = response.result.items;

                $.each(res, function(i) {
                    var id = res[i].snippet.resourceId.videoId;

                    var request = gapi.client.youtube.videos.list({
                        id: id,
                        part: 'statistics,contentDetails,snippet'
                    });

                    request.execute(function(response) {
                        var res = response.result.items;
                        var item = {
                            id: id,
                            title: res[0].snippet.title,
                            description: res[0].snippet.description,
                            excerpt: $scope.$parent.makeExcerpt(res[0].snippet.description),
                            thumbnail: res[0].snippet.thumbnails.medium.url,
                            author: res[0].snippet.channelTitle,
                            likes: res[0].statistics.likeCount,
                            dislikes: res[0].statistics.dislikeCount,
                            views: res[0].statistics.viewCount,
                            duration: $scope.translateDuration(res[0].contentDetails.duration),
                            publishedAt: res[0].snippet.publishedAt
                        };

                        if( angular.isUndefined(channelData.activePlaylist.videos) ) {
                            channelData.activePlaylist.videos = [];
                        }
                        channelData.activePlaylist.videos.push(item);

                        $scope.$apply(function() {
                            $scope.activePlaylist = channelData.activePlaylist;
                        });
                    })
                });
            } else {
                console.error(response.code, response.error.message);
                $('#errorModal').modal('show');
            }
        });
    };

    $scope.makeActive = function(index) {
        if( angular.isDefined(channelData.activeVideo) ) {
            channelData.activeVideo.selected = false;
        }

        channelData.activeVideo = channelData.activePlaylist.videos[index];
        channelData.activeVideo.selected = true;
        channelData.simplified.video = channelData.activeVideo.title;

        channelData.nextVideo = ++index;
        channelData.player.loadVideoById(channelData.activeVideo.id);

        $scope.$broadcast('playing');
    }

    $scope.translateDuration = function(dur) {
        var l = dur.length;
        var indexT = dur.indexOf('T');
        if( indexT != -1 ) {
            dur = dur.slice(indexT + 1, l);
        } else {
            dur = dur.slice(2, l);
        }

        var indexH = dur.indexOf('H'),
          h = indexH != -1 ? dur.slice(0, indexH) : '',
          indexM = dur.indexOf('M'),
          m = indexM != -1 ? dur.slice(indexH + 1, indexM) : '0',
          indexS = dur.indexOf('S'),
          s = indexS != -1 ? dur.slice(indexM + 1, indexS) : '';

        var output = '';

        if( h != '' ) {
            output += h + ':';
            if( m.length == 1 ) {
                m = '0' + m;
            }
        }
        if( m != '' ) {
            output += m + ':';
            if( s.length == 1 ) {
                s = '0' + s;
            }
        }
        if( s != '' ) {
            output += s;
        }

        return output;
    };

    $scope.$on('getVideos', $scope.getVideos);
}]);