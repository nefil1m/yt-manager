app.controller('searchCtrl', ['$rootScope', '$scope', 'channel', function($rootScope, $scope, channel) {
    // var getItem = function(id) {
    //     var request = gapi.client.youtube.videos.list({
    //         id: id,
    //         part: 'snippet'
    //     });
    // }

    $scope.videos = [];
    $scope.token;

    $scope.search = function(keywords) {
        var request = gapi.client.youtube.search.list({
            q: keywords,
            part: 'snippet',
            maxResults: 20
        });

        request.execute(function(response) {
            var res = response.result.items;

            if( angular.isUndefined(response.error) ) {
                $scope.token = response.result.nextPageToken;
                console.log(res[0]);

                $.each(res, function(i) {
                    var video = {
                        id: res[i].id.videoId,
                        title: res[i].snippet.title,
                        description: res[i].snippet.description,
                        thumbnail: res[i].snippet.thumbnails.medium.url,
                        author: res[i].snippet.channelTitle,
                        publishedAt: res[i].snippet.publishedAt,
                        source: 'search'
                        // likes: res[i].statistics.likeCount,
                        // dislikes: res[i].statistics.dislikeCount,
                        // views: res[i].statistics.viewCount
                        // duration: translateDuration(res[i].contentDetails.duration);
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
        console.log(channel.player.loadVideoById, $scope.videos[index].id);
    };
}]);