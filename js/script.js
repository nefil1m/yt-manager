var playlistId,
    videoId,
    channelId,
    nextPageToken,
    prevPageToken,
    activePlaylistId,
    activePlaylistName,
    activePlaylistThumbnail,
    activeVideo,
    prevVideo,
    nextVideo;

var requestUserPlaylists = function(channelId) {
  $('#playlists-list').html('');
  var request = gapi.client.youtube.playlists.list({
    channelId: channelId,
    part: 'id,snippet',
    maxResults: 50
  });

  request.execute(function(response) {
    var res = response.result.items;
    var i = res.length - 1;

    for( ; i >= 0; i-- ) {
      var item = {};

      item.id = res[i].id;
      item.thumbnail = res[i].snippet.thumbnails.medium.url;
      item.title = res[i].snippet.title;
      item.description = res[i].snippet.description;

      appendPlaylist(item);
    }
  });
}

var requestWatchLaterPlaylist = function(playlist) {
  var request = gapi.client.youtube.playlists.list({
    id: playlist,
    part: 'snippet,id',
    maxResults: 50
  });

  request.execute(function(response) {
    var res = response.result.items[0];

      var item = {};

      item.id = res.id;
      item.title = res.snippet.title;
      item.thumbnail = res.snippet.thumbnails.medium.url;
      item.description = res.snippet.description;

      appendPlaylist(item);
  });
}

var appendPlaylist = function(item, active) {

  if( active ) {
    var container = $('#active-playlist');
    var html = '';
  } else {
    var container = $('#playlists-list');
    var html = $('#playlists-list').html();
  }

  html += '<li class="row item"><a href="#!" data-id="' +
          item.id +
          '" title="' +
          item.description +
          '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
          item.thumbnail +
          '"><div class="btn-group"><button type="button" class="btn btn-default add" title="Add current video to this playlist"><i class="glyphicon glyphicon-plus"></i></button><button type="button" class="btn btn-default listen" title="Play this playlist"><i class="glyphicon glyphicon-play"></i></button><button type="button" class="btn btn-default delete" title="Delete playlist"><i class="glyphicon glyphicon-ban-circle"></i></button></div></div><h4 class="title">' +
          item.title +
          '</h4>' +
          makeExcerpt(item.description) +
          '</div></a></li>';

  container.html(html);
}

var appendVideos = function(videoSnippet) {

  $('#playlist-videos').append(
    '<li class="row item"><a href="#!" data-id="' +
    videoSnippet.resourceId.videoId +
    '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
    videoSnippet.thumbnails.medium.url +
    '"><div class="btn-group"><button type="button" class="btn btn-default add" title="Add current video to active playlist"><i class="glyphicon glyphicon-plus"></i></button><button type="button" class="btn btn-default listen" title="Play this video"><i class="glyphicon glyphicon-play"></i></button><button type="button" class="btn btn-default play-from-here" title="Plat this playlist starting from this video"><i class="glyphicon glyphicon-circle-arrow-right"></i></button><button type="button" class="btn btn-default delete" title="Delete video from playlist"><i class="glyphicon glyphicon-ban-circle"></i></button></div></div><h4 class="title">' +
    videoSnippet.title +
    '</h4><p class="author">' +
    videoSnippet.author +
    '<p class="excerpt">' +
    makeExcerpt(videoSnippet.description) +
    '</p></div></a></li>'
    );
}

var requestVideos = function(playlistId, pageToken) {
  $('#video-container').html('');

  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet',
    maxResults: 10
  };

  if (pageToken) {
    requestOptions.pageToken = pageToken;
  }

  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {

    nextPageToken = response.result.nextPageToken;

    var playlistItems = response.result.items;
    if (playlistItems) {
      $.each(playlistItems, function(index, item) {
        appendVideos(item.snippet);
      });
    } else {
      $('#video-container').html('Sorry you have no videos in this playlist');
    }
  });
}

var addNewPlaylist = function() {
  if( typeof channelId != 'undefined' ) {
    $('#newPlaylistModal').modal('show');

    $('#newPlaylistSubmit').on('click', function(){
      var title = $('#playlistName').val(),
          description = $('#playlistDescription').val(),
          tags = $('#playlistTags').val().split(' '),
          status = 'public';

      if( $('#playlistStatus').is(':checked') ) {
        status = 'private';
      }

      var request = gapi.client.youtube.playlists.insert({
        part: 'snippet,status',
        resource: {
          snippet: {
            title: title,
            description: description
          },
          status: {
            privacyStatus: status
          }
        }
      });

      request.execute(function(response) {
        var res = response.result;

        if( res ) {
          var item = {};
          item.id = res.id;
          item.title = title;
          item.description = description;
          item.thumbnail = res.snippet.thumbnails.medium.url;

          appendPlaylist(item);
        } else {
          alert('Something went wrong. Try again later');
        }
      });
    });
  } else {
    $('#authorizationModal').modal('show');
  }
}

var nextPage = function() {
  requestVideos(playlistId, nextPageToken);
}

var previousPage = function() {
  requestVideos(playlistId, prevPageToken);
}

var makeExcerpt = function(string) {
  if( string.length >= 119 ) {
    return string.slice(0,120) + "...";
  } else if( string.length <= 0 ) {
    return "...";
  } else {
    return string;
  }
}

var playVideo = function() {
  player.loadVideoById({
    videoId: activeVideo,
    startSeconds: 0,
    endSeconds: 9999
  });
  changeStatus('play');
}

// onclicks

//on playlist
$('#playlists-list').on('click', 'a', function(){
  playlistId = $(this).data('id');

  var item = {};
  item.id = playlistId;
  item.thumbnail = $(this).find('img').attr('src');
  item.title = $(this).find('.title').text();
  item.description = $(this).find('.description').text();

  $('#playlists').removeClass('in');
  $('#playlist-videos, #active-playlist').addClass('in');

  appendPlaylist(item, true);
  requestVideos(playlistId);
});

$('.add-new-playlist').on('click', 'a', function(){
  addNewPlaylist();
});

//on video
$('#playlist-videos').on('click', 'a', function(){
  var title = $(this).find('.title').text();
  activeVideo = $(this).data('id');
  playVideo();
});

$('#login-link').click(function(){
  checkAuth();
});


$('#authorizationModal').modal();