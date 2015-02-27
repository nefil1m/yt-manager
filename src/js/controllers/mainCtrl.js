app.controller('mainCtrl', ['$rootScope', '$scope', 'channel', '$cookieStore', '$location', function($rootScope, $scope, channel, $cookieStore, $location) {
  var CLIENT_ID = '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
    SCOPES = [ 'https://www.googleapis.com/auth/youtube' ],
    apiKey = 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y';

  $scope.auth = function(){
    gapi.client.setApiKey = apiKey;
    $scope.checkAuth();
  };

  $scope.checkAuth = function() {
    gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: true
    }, makeApiCall);
  };

  var makeApiCall = function() {
    gapi.client.load('youtube', 'v3', function() {
      var request = gapi.client.youtube.channels.list({
        mine: true,
        part: 'id,snippet'
      });

      request.execute(function(response) {
        var res = response.result.items[0];

        $rootScope.authorized = true;

        channel.basic = {
          authorized: true,
          title: res.snippet.title,
          id: res.id,
          thumbnail: res.snippet.thumbnails.default.url
        };

        $scope.$apply();
        $scope.success('logged');

        if( $location.url() === '/login' ) {
          $location.url('/playlists');
        }
      });
    });
  };

  //init options

  $scope.channel = channel;

  var options = $cookieStore.get('options');

  if( angular.isDefined(options) ) {
    channel.options = options;
    if( channel.options.rememberMe ) {
      window.setTimeout($scope.auth, 1000);
    } else {
      $location.url('/');
    }
  }

  $scope.success = function(msg) {
    $scope.msg = msg;
    $scope.$apply();

    $('#success-box').addClass('visible');

    var tOut = setTimeout(function() {
      $('#success-box').removeClass('visible');
    }, 7500);

    $('#success-box').find('span').on('click', function() {
      clearTimeout(tOut);
      $('#success-box').removeClass('visible');
    });
  };
}]);