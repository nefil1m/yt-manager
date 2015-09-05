angular.module('YTPlaylistManager')
.factory('YTResourceProvider', ['$q', '$config', function($q, $config) {
  var YTResourceProvider = {};

  YTResourceProvider.auth = function() {
    var def = $q.defer();

    gapi.client.setApiKey = $config.API_KEY;

    gapi.auth.authorize({
      client_id: $config.CLIENT_ID,
      scope: $config.SCOPE,
      immediate: false
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

  YTResourceProvider.sendRequest = function(options, requestType) {
    var def = $q.defer();
    var args = requestType.split('.');
    var request = gapi.client.youtube[args[0]][args[1]](options);

    request.execute(function(response) {
      if(response.error) {
        def.reject(response.error);
      } else {
        def.resolve(response);
      }
    });

    return def.promise;
  };

  return YTResourceProvider;
}]);
