app.factory('Video', ['$rootScope', function($rootScope){
    var Video = function(id) {
        var translateDuration = function(dur) {
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
                    that.duration = translateDuration(res.contentDetails.duration);
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