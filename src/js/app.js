var app = angular.module('YTPlaylistManager', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngCookies'])

            .constant('$config', {
              CLIENT_ID: '877549163404-chjiknp3ffeiatmb2mcb8dfp23u7sm8q.apps.googleusercontent.com',
              SCOPE: 'https://www.googleapis.com/auth/youtube',
              API_KEY: 'AIzaSyDJIOlGzyjPFEQ5j-Q2qEJVbOJtgqmby_Y'
            })

            .run(['$rootScope', '$location', '$cookieStore', 'channel', 'OAuth',
              function($rootScope, $location, $cookieStore, channel, OAuth) {

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
                      OAuth.auth()
                        .then(function(response) {
                          var res = response.result.items[0];

                          $rootScope.authorized = true;
                          channel.basic = {
                            authorized: true,
                            title: res.snippet.title,
                            id: res.id,
                            thumbnail: res.snippet.thumbnails.default.url
                          };

                          if( $location.url() === '/login') {
                            $location.url('/playlists');
                          } else {
                            $location.url($location.url()); // xD
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