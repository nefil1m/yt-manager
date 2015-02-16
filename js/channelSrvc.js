app.service('channel', ['$rootScope', 'Playlist', 'Video', function($rootScope, Playlist, Video) {

    var channel = {
        // id: '',
        // title: 'title',
        authorized: false,
        // playlistCount: 1,
        // playlists: [
        //     {
        //         id: '',
        //         title: '',
        //         description: '',
        //         tags: [],
        //         status: '',
                // videos: [
        //             {
        //                 id: '',
        //                 title: '',
        //                 author: '',
        //                 description: '',
        //                 likes: '',
        //                 dislikes: '',
        //                 views: '',
        //                 publishedAt: ''
        //             }
        //         ]
        //     }
        // ],
        // activePlaylist: {
        //     id: '',
        //     title: '',
        //     description: '',
        //     tags: [],
        //     status: '',
            // videos: [
        //         {
        //             id: '',
        //             title: '',
        //             author: '',
        //             description: '',
        //             likes: '',
        //             dislikes: '',
        //             views: '',
        //             publishedAt: ''
        //         }
            // ]
        // },
        // activeVideo: {
        //     title: 'Touch and go - Tango in Harlem'
        // },
        // prevVideo: '',
        // nextVideo: '',
        playState: 'stopped',
        simplified: {
            playState: 'stopped'
        },
        requestPlaylists: function() {
            if( channel.authorized ) {

                if( angular.isUndefined(channel.playlistCount) || channel.playlists.length < channel.playlistCount ) {

                    var options = {
                        channelId: channel.id,
                        part: 'id',
                        maxResults: 6
                    }

                    if( angular.isDefined(channel.playlistToken) ) {
                        options.pageToken = channel.playlistToken;
                    }

                    var request = gapi.client.youtube.playlists.list(options);

                    request.execute(function(response) {
                        if( angular.isUndefined(response.error) ) {

                            channel.playlistToken = response.result.nextPageToken;
                            channel.playlistCount = response.result.pageInfo.totalResults;

                            var res = response.result.items,
                                playlists = [];

                            $.each(res, function(i) {
                                playlists[i] = new Playlist(res[i].id);
                                playlists[i].get();
                            });

                            if( angular.isUndefined(channel.playlists) ) {
                                channel.playlists = playlists;
                            } else {
                                channel.playlists = channel.playlists.concat(playlists);
                            }

                        } else {
                            console.error(response.code, response.error.message);
                            $('#errorModal').modal('show');
                        }
                    });
                }
            } else {
                $rootScope.$emit('throwError', { code: 401, message: "Channel is not authorized" });
            }
        },
        requestVideos: function() {
            var length = angular.isUndefined(channel.activePlaylist.videos) ? 0 : channel.activePlaylist.videos.length;

            if( channel.activePlaylist.itemCount > length ) {

                var options = {
                    playlistId: channel.activePlaylist.id,
                    part: 'snippet',
                    maxResults: 21
                };

                if( angular.isDefined(channel.activePlaylist.nextVideosToken) ) {
                    options.pageToken = channel.activePlaylist.nextVideosToken;
                }

                var request = gapi.client.youtube.playlistItems.list(options);

                request.execute(function(response) {
                    channel.activePlaylist.nextVideosToken = response.result.nextPageToken;

                    if( angular.isUndefined(response.error) ) {
                        var res = response.result.items,
                            videos = [];

                        $.each(res, function(i) {
                            videos[i] = new Video(res[i].snippet.resourceId.videoId);
                            videos[i].resId = res[i].id;
                            videos[i].get();
                        });

                        if( angular.isUndefined(channel.activePlaylist.videos) ) {
                            channel.activePlaylist.videos = videos;
                            $rootScope.$emit('videosLoaded', 0);
                        } else {
                            channel.activePlaylist.videos = channel.activePlaylist.videos.concat(videos);
                        }

                    } else {
                        $rootScope.$emit('throwError', response.error);
                    }
                });
            }
        }
    };

    return channel;
}]);
