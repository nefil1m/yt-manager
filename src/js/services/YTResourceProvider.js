app.factory('YTResourceProvider', ['$q', '$config', function($q, $config) {
  var YTResourceProvider = {};

  YTResourceProvider.auth = function() {
    var def = $q.defer();

    gapi.client.setApiKey = $config.API_KEY;

    gapi.auth.authorize({
      client_id: $config.CLIENT_ID,
      scope: $config.SCOPE,
      immediate: true
    }, function() {
      gapi.client.load('youtube', 'v3', function() {
        var request = gapi.client.youtube.channels.list({
          mine: true,
          part: 'id,snippet'
        });

        request.execute(function(response) {
          if( response.error ) {
            def.reject(response.error);
          } else {
            def.resolve(response);
          }
        });
      });
    });

    return def.promise;
  };

  YTResourceProvider.getVideo = function(id) {
    var def = $q.defer();

    var request = gapi.client.youtube.videos.list({
      id: id,
      part: 'snippet,contentDetails,statistics'
    });

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  YTResourceProvider.search = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.search.list(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  YTResourceProvider.getPlaylists = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.playlists.list(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  YTResourceProvider.getPlaylistItems = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.playlistItems.list(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  YTResourceProvider.newPlaylist = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.playlists.insert(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  YTResourceProvider.editPlaylist = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.playlists.update(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };
  YTResourceProvider.deletePlaylist = function(options) {
    var def = $q.defer();
    var request = gapi.client.youtube.playlists.delete(options);

    request.execute(function(response) {
      if( response.error ) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  }

  return YTResourceProvider;
}]);