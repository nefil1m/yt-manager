app.factory('Playlist', ['$rootScope', function($rootScope) {
    var Playlist = function(id) {

        if( angular.isDefined(id) ) {
            this.id = id;
        }

        this.new = function(playlist) {
            var that = this;

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

                    that.id = res.id;
                    that.title = playlist.title;
                    that.description = playlist.description;
                    that.status = playlist.status;
                    if( res.snippet.thumbnails.medium.url == "https://i.ytimg.com/vi/default.jpg" ) {
                        that.thumbnail = 'img/default.jpg';
                    } else {
                        that.thumbnail = res.snippet.thumbnails.medium.url;
                    }
                    that.itemCount = 0;
                    $rootScope.$emit('throwSuccess', 'Successfuly added playlist "' + playlist.title + '"' );
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        };

        this.get = function() {
            var that = this;
            var request = gapi.client.youtube.playlists.list({
                id: this.id,
                part: 'snippet,status,contentDetails'
            });


            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    var res = response.result.items[0];

                    that.title = res.snippet.title;
                    if( res.snippet.thumbnails.medium.url == "https://i.ytimg.com/vi/default.jpg" ) {
                        that.thumbnail = 'img/default.jpg';
                    } else {
                        that.thumbnail = res.snippet.thumbnails.medium.url;
                    }
                    that.description = res.snippet.description;
                    that.tags = res.snippet.description;
                    that.status = res.status.privacyStatus;
                    that.itemCount = res.contentDetails.itemCount;
                    $rootScope.$emit('applyPlaylist');
                } else {
                    $rootScope.$emit('throwError', response.error);
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
                    $rootScope.$emit('throwError', response.error);
                }
            });
        };

        this.edit = function() {
            var tags = angular.isUndefined(this.tags) ? '' : this.tags.replace(/,\s/g, ",").split(',');

            var request = gapi.client.youtube.playlists.update({
                id: this.id,
                part: 'snippet,status',
                snippet: {
                    title: this.title,
                    description: this.description,
                    tags: tags
                },
                status: {
                    privacyStatus: this.status
                }
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    $('#editPlaylistModal').modal('hide');
                    $rootScope.$emit('editPlaylist');
                    $rootScope.$emit('throwSuccess', 'Playlist updated');
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        };

        this.updatePrivacy = function(privacy) {
            var that = this;
            var request = gapi.client.youtube.playlists.update({
                id: this.id,
                part: 'snippet,status',
                snippet: {
                    title: this.title,
                    description: this.description,
                    tags: this.tags
                },
                status: {
                    privacyStatus: privacy
                }
            });

            request.execute(function(response) {
                if( angular.isUndefined(response.error) ) {
                    $rootScope.$emit('changePrivacy');
                    that.status = privacy;
                    $rootScope.$emit('throwSuccess', 'Success');
                } else {
                    $rootScope.$emit('throwError', response.error);
                }
            });
        }

        return this;
    };

    return Playlist;
}]);