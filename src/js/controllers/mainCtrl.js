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

    $scope.translateDuration = function(dur) { // to fix : days
        var l = dur.length;
        var indexT = dur.indexOf('T');
        if( indexT != -1 ) {
            dur = dur.slice(indexT + 1, l);
        } else {
            dur = dur.slice(2, l);
        }

        var indexH = dur.indexOf('H'),
            h = indexH != -1 ? dur.slice(0, indexH) : '',
            indexM = dur.indexOf('M'),
            m = indexM != -1 ? dur.slice(indexH + 1, indexM) : '0',
            indexS = dur.indexOf('S'),
            s = indexS != -1 ? dur.slice(indexM + 1, indexS) : '';

        var output = '';

        if( h != '' ) {
            output += h + ':';
            if( m.length == 1 ) {
                m = '0' + m;
            }
        }
        if( m != '' ) {
            output += m + ':';
            if( s.length == 1 ) {
                s = '0' + s;
            } else if( s.length == 0 ) {
              s = '00';
            }
        }
        if( s != '' ) {
            output += s;
        }

        return output;
    };

    $scope.addCommas = function(number) {
      var temp = [],
          output = '';

      for( var i = number.length; i > 0; i -= 3 ) {
        var j = i > 2 ? i - 3 : 0;
        var threes = number.slice(j, i);
        temp.push(threes);
      }

      for( var i = temp.length - 1; i >= 0 ; i-- ) {
        if( i ) {
          output += temp[i] + ',';
        } else {
          output += temp[i];
        }
      }

      return output;
    };

  }]);