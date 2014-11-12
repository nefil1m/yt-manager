app.factory('channelData', function($rootScope) {
    this.channel = {
        // id: '',
        title: 'title',
        playlists: [],
        activePlaylist: '',
        activeVideo: '',
        prevVideo: '',
        nextVideo: ''
    };

    return this.channel;
})
