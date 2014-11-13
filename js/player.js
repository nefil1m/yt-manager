var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '450',
    width: '800',
    videoId: 'qDxtsPseia8',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
    changeStatus('play');
  }
}

function stopVideo() {
  player.stopVideo();
  changeStatus('stop');
}

var changeStatus = function(status) {
  var buttons = $('.player-buttons'),
      info = $('.play-status');

  buttons.find('.active').removeClass('active');

  switch(status) {
    case 'stop':
      buttons.find('.stop').addClass('active');
      info.find('.play-state').text('Stopped');
    break;

    case 'play':
      buttons.find('.play').addClass('active');
      info.find('.play-state').text('Playing');
    break;

    case 'pause':
      buttons.find('.pause').addClass('active');
      info.find('.play-state').text('Playing');
    break;
  }
}