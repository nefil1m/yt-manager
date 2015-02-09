app.factory('Video', function(){
    var Video = function() {

    };

    return Video;
}).factory('Playlist', ['$rootScope', 'Video', function($rootScope, Video) {
    var Playlist = function(ytRes) {

        if( angular.isDefined(ytRes.id) ) {
            this.id = ytRes.id;
        }

        if( angular.isDefined(ytRes.snippet) ) {
            this.thumbnail = ytRes.snippet.thumbnails.medium.url;
            this.title = ytRes.snippet.title;
            this.description = ytRes.snippet.description;
            this.tags = ytRes.snippet.tags;
        } else {
            this.thumbnail = ytRes.thumbnail;
            this.title = ytRes.title;
            this.description = ytRes.description;
            this.tags = ytRes.tags;
        }

        if( angular.isDefined(ytRes.status) ) {
            this.status = ytRes.status.privacyStatus;
        } else {
            this.status = ytRes.status;
        }

        if( angular.isDefined(ytRes.contentDetails) ) {
            this.itemCount = ytRes.contentDetails.itemCount;
        } else {
            this.itemCount = 0;
        }

        this.new = function(playlist) {
            var options = {
                part: 'snippet,status',
                resource: {
                    snippet: {
                        title: playlist.title,
                        description: playlist.description,
                        tags: playlist.tags
                    },
                    status: {
                        privacyStatus: playlist.status
                    }
                }
            };

            var request = gapi.client.youtube.playlists.insert(options);

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    var res = response.result;

                    playlist.id = res.id;
                    playlist.thumbnail = res.snippet.thumbnails.medium.url;
                    playlist.itemCount = 0;

                    $rootScope.$emit('newPlaylist');
                } else {
                    console.error(response.code, response.error.message);
                    $('#errorModal').modal('show');
                }
            });
        };

        this.get = function(playlist) {
            var request = gapi.client.youtube.playlists.list({
                id: playlist.id,
                part: 'snippet,status,contentDetails'
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    var res = response.result.items[0];

                    playlist.title = res.snippet.title;
                    playlist.thumbnail = res.snippet.thumbnails.medium.url;
                    playlist.description = res.snippet.description;
                    playlist.tags = res.snippet.description;
                    playlist.status = res.status.privacyStatus;
                    playlist.itemCount = res.contentDetails.itemCount;
                } else {
                    console.error(response.code, response.error.message);
                    $('#errorModal').modal('show');
                }
            });
        };

        this.delete = function() {
            var request = gapi.client.youtube.playlists.delete({
                id: this.id
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    $rootScope.$emit('deletePlaylist');
                } else {
                    console.log(response.code, response.error.message);
                    $("#errorModal").modal('show');
                }
            });
        };

        return this;
    };

    return Playlist;
}]);