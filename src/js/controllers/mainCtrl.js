app.controller('mainCtrl', ['$rootScope', '$scope', 'channel',
  function($rootScope, $scope, channel) {
    $scope.channel = channel;

    function showInfoBox(type, info) {
      $scope.infoMsg = info;

      $('#info-box').addClass('visible').addClass(type);

      var tOut = setTimeout(function() {
        $('#info-box').removeClass('visible').addClass(type);
      }, 7500);

      $('#info-box').find('span').on('click', function() {
        clearTimeout(tOut);
        $('#info-box').removeClass('visible').addClass(type);
      });
    };

    $scope.success = function(msg) {
      showInfoBox('success', msg);
    };

    $scope.error = function(msg) {
      showInfoBox('error', msg);
    };

  }]);