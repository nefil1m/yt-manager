app.factory('Video', ['$rootScope', function($rootScope){
    var Video = function(id) {


        this.id = id;

        this.get = function() {
            var that = this;
            var request = gapi.client.youtube.videos.list({
                id: this.id,
                part: 'snippet,contentDetails,statistics'
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    var res = response.result.items[0];

                    that.title = res.snippet.title;
                    that.description = res.snippet.description;
                    //excerpt?
                    that.thumbnail = res.snippet.thumbnails.medium.url;
                    that.author = res.snippet.channelTitle;
                    that.publishedAt = res.snippet.publishedAt;
                    that.likes = res.statistics.likeCount;
                    that.dislikes = res.statistics.dislikeCount;
                    that.views = res.statistics.viewCount;
                    that.duration = $rootScope.translateDuration(res.contentDetails.duration);
                    that.startAt = res.contentDetails.startAt;
                    that.endAt = res.contentDetails.endAt;
                    that.note = res.contentDetails.note;
                    that.source = 'playlist';
                    $rootScope.$emit('applyVideo');
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        };

        return this;
    };

    return Video;
}]);