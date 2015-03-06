app.controller('mainCtrl', ['$rootScope', '$scope', 'channel', '$cookieStore', '$location', '$config', 'OAuth',
  function($rootScope, $scope, channel, $cookieStore, $location, $config, OAuth) {
    $scope.channel = channel;

    // var options = $cookieStore.get('options');

    // if( angular.isDefined(options) ) {
    //   channel.options = options;
    //   if( channel.options.rememberMe ) {
    //     window.setTimeout(function() {
    //       OAuth.auth()
    //         .then(function(response) {
    //           var res = response.result.items[0];

    //           $rootScope.authorized = true;
    //           channel.basic = {
    //             authorized: true,
    //             title: res.snippet.title,
    //             id: res.id,
    //             thumbnail: res.snippet.thumbnails.default.url
    //           };

    //           $scope.success('logged');
    //           if( $location.url() === '/login') $location.url('/playlists');
    //         }, function(response) {
    //           $scope.error(response.error)
    //         });
    //     }, 500);
    //   } else {
    //     $location.url('/');
    //   }
    // }

    $scope.success = function(msg) {
      // $scope.msg = msg;
      // // $scope.$apply();

      // $('#info-box').addClass('visible');

      // var tOut = setTimeout(function() {
      //   $('#info-box').removeClass('visible');
      // }, 7500);

      // $('#info-box').find('span').on('click', function() {
      //   clearTimeout(tOut);
      //   $('#info-box').removeClass('visible');
      // });
      showInfoBox('success', msg);
    };

    $scope.error = function(msg) {
      // console.log(msg);
    };

    var showInfoBox = function(type, info) {
      $scope.infoMsg = info;

      $('#info-box').addClass('visible ' + type);

      var tOut = setTimeout(function() {
        $('#info-box').removeClass('visible ' + type);
      }, 7500);

      $('#info-box').find('span').on('click', function() {
        clearTimeout(tOut);
        $('#info-box').removeClass('visible ' + type);
      });
    }
  }]);