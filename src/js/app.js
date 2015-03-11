var app = angular.module('YTPlaylistManager',
  ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngCookies'])

            .constant('$config', {
              CLIENT_ID: '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
              SCOPE: 'https://www.googleapis.com/auth/youtube',
              API_KEY: 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y'
            })

            .run(['$rootScope', '$location', '$cookieStore', 'channel', 'YTResourceProvider',
              function($rootScope, $location, $cookieStore, channel, YTResourceProvider) {

                $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                  var requireLogin = toState.data.requireLogin;
                  if( requireLogin && angular.isUndefined($rootScope.authorized) ) {
                    event.preventDefault();
                  }
                });

                var options = $cookieStore.get('options');

                if( angular.isDefined(options) ) {
                  channel.options = options;
                  if( channel.options.rememberMe ) {
                    window.setTimeout(function() {
                      YTResourceProvider.auth()
                        .then(function(response) {
                          var res = response.result.items[0];

                          $rootScope.authorized = true;
                          channel.basic = {
                            authorized: true,
                            title: res.snippet.title,
                            id: res.id,
                            thumbnails: res.snippet.thumbnails
                          };

                          if( $location.url() === '/login') {
                            $location.url('/playlists');
                          }
                        }, function(response) {
                          alert('Login failed');
                        });
                    }, 500);
                  } else {
                    $location.url('/');
                  }
                }
            }]);