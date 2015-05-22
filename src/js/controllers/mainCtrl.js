angular.module('YTPlaylistManager')
.controller('mainCtrl', ['$rootScope', '$scope', 'channel', 'YTResourceProvider',
  function($rootScope, $scope, channel, YTResourceProvider) {
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

    $scope.progress = function(progress) {
      var $bar = $('#progress .loading-bar');
      $bar.css('opacity', 1);
      $bar.css('width', progress + "vw");
      if( progress > 99 ) {
        $bar.css('opacity', 0);
      }
    };

    $(document).ready(function() {
      $rootScope.resizeTh = function() {
        var thumbs = $('.yt-items-list').find('.thumb');
        var thWidth = parseInt(thumbs.width(), 10);
        thumbs.css('height', thWidth / 1.778);
      };

      var resizePlayer = function() {
        var player = $("#player");
        player.height( parseInt(player.width(), 10) * 0.5225 + "px");
      }

      $('#collapse').on('click', function() {
        $('[size-sensitive]').toggleClass('small');
      });

      $(document).on('click', function() {
        $('nav').removeClass('opened');
      });

      $('.toggle-nav').on('click', function(e) {
        e.stopPropagation();
        $('nav').toggleClass('opened');
      });

      $(window).resize($rootScope.resizeTh);
      $(window).resize($rootScope.resizePlayer);
    });

    $scope.logout = function() {
      gapi.auth.signOut();
    };

    $scope.addVideo = function(playlist) {
      var options = {
        part: 'snippet',
        snippet: {
          playlistId: playlist.id,
          resourceId: {
            kind: 'youtube#video',
            videoId: channel.activePlaylist.videos[channel.activeVideo].id
          }
        }
      }

      YTResourceProvider.sendRequest(options, 'playlistItems.insert')
      .then(function(response) {
        $scope.success('Added video');
      }, function(response) {
        console.log(response);
        $scope.error('Cannot add video');
      });
    };

    $scope.rateVideo = function(rating) {
      var video = channel.activePlaylist.videos[channel.activeVideo];
      var options = {
        id: video.id
      }

      console.log(video);

      options.rating = video.rating === rating ? 'none' : rating;

      YTResourceProvider.sendRequest(options, 'videos.rate')
        .then(function(response) {
          video.rating = rating;
        }, function(response) {
          console.log(response);
        });
    };

    $scope.$watch(function() { return channel.activeVideo }, function() {
      if(angular.isDefined(channel.activePlaylist)) {
        $scope.video = channel.activePlaylist.videos[channel.activeVideo];
      }
    });
  }]);