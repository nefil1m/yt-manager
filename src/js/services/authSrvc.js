app.factory('OAuth', ['$config', '$rootScope', '$q', function($config, $rootScope, $q) {
  var OAuth = {};

  OAuth.auth = function() {
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

  return OAuth;
}]);