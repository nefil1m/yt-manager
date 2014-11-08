var playlistId,
    videoId,
    channelId,
    nextPageToken,
    prevPageToken,
    activeVideo,
    prevVideo,
    nextVideo;

var requestUserPlaylists = function(channelId) {
  $('#playlists-list').html('');
  var request = gapi.client.youtube.playlists.list({
    channelId: channelId,
    part: 'id,snippet,status',
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
      item.status = res[i].status.privacyStatus;

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
      item.status = 'public';

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

  html += '<li class="row item" id="' +
          item.id +
          '">' +
          checkStatus(item.status) +
          '<a href="#!" data-id="' +
          item.id +
          '" title="' +
          item.description +
          '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
          item.thumbnail +
          '"></div><h4 class="title">' +
          item.title +
          '</h4><p class="excerpt">' +
          makeExcerpt(item.description) +
          '</p></div></a><div class="btn-group"><a class="btn btn-default add" title="Add current video to this playlist"><i class="glyphicon glyphicon-plus"></i></a><a class="btn btn-default listen" title="Play this playlist"><i class="glyphicon glyphicon-play"></i></a><a class="btn btn-default edit" title="Edit playlist"><i class="glyphicon glyphicon-edit"></i></a><a class="btn btn-default delete" title="Delete playlist"><i class="glyphicon glyphicon-ban-circle"></i></a></div></li>';

  container.html(html);
}

var appendVideos = function(item) {

  $('#playlist-videos').append(
    '<li class="row item" id="' +
    item.id +
    '"><div class="info"><div class="row"><div class="col-xs-6 likes"><p class="count">' +
    item.likes +
    '</p></div><div class="col-xs-6 dislikes"><p class="count">' +
    item.dislikes +
    '</p></div></div><p class="duration">' +
    translateDuration(item.duration) +
    '</p></div><a href="#!" data-id="' +
    item.id +
    '" data-publishedAt="' +
    item.publishedAt +
    '"><div class="col-xs-12"><div class="pull-left th"><img src="' +
    item.thumbnail +
    '"></div><h4 class="title">' +
    item.title +
    '</h4><p class="author">' +
    item.author +
    '<p class="excerpt">' +
    makeExcerpt(item.description) +
    '</p></div></a><div class="btn-group"><a class="btn btn-default add" title="Add this video to another playlist"><i class="glyphicon glyphicon-plus"></i></a><a class="btn btn-default listen" title="Play this video"><i class="glyphicon glyphicon-play"></i></a><a class="btn btn-default delete" title="Delete video from playlist"><i class="glyphicon glyphicon-ban-circle"></i></a></div></li>'
    );
}

var requestVideos = function(playlistId, pageToken) {
  $('#video-container').html('');

  var requestOptions = {
    playlistId: playlistId,
    part: 'snippet,contentDetails',
    maxResults: 10
  };

  if (pageToken) {
    requestOptions.pageToken = pageToken;
  }

  var request = gapi.client.youtube.playlistItems.list(requestOptions);
  request.execute(function(response) {

    nextPageToken = response.result.nextPageToken;

    var res = response.result.items;

    if (res) {
      $.each(res, function(i, items) {
        var data = res[i].snippet;
        var item = {};
        item.id = data.resourceId.videoId;
        item.title = data.title;
        item.description = data.description;
        item.thumbnail = data.thumbnails.medium.url;
        item.publishedAt = data.publishedAt;

        var request = gapi.client.youtube.videos.list({
          id: item.id,
          part: 'statistics,contentDetails,snippet'
        });

        request.execute(function(response) {
          var res = response.result.items[0].statistics;
          item.author = response.result.items[0].snippet.channelTitle;
          item.likes = res.likeCount;
          item.dislikes = res.dislikeCount;
          item.views = res.viewCount;
          item.duration = response.result.items[0].contentDetails.duration;
          appendVideos(item);
        });
      });
    } else {
      $('#video-container').html('Sorry you have no videos in this playlist');
    }
  });
}

var addNewPlaylist = function() {
  if( typeof channelId != 'undefined' ) {
    $('#newPlaylistModal').modal('show');

    $('#newPlaylistSubmit').not(':disabled').on('click', function(){
      $('#newPlaylistModal').modal('hide');

      var title = $('#playlistName').val(),
          description = $('#playlistDescription').val(),
          tags = $('#playlistTags').val().split(' '),
          status = 'public';

      if( $('#playlistPrivate').is(':checked') ) {
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
        console.lo(res);
        if( res ) {
          var item = {};
          item.id = res.id;
          item.title = title;
          item.description = description;
          item.thumbnail = res.snippet.thumbnails.medium.url;
          item.status = status;

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

var removeItemFromList = function(id) {
  $("#" + id).remove();
}

var removePlaylist = function(id) {
    var request = gapi.client.youtube.playlists.delete({
      id: id
    });

    request.execute(function(response) {
      if( !!response ) {
        removeItemFromList(id);
      }
    });
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

var checkStatus = function(status) {
  if( status === 'public') {
    return '';
  } else if( status === 'private' ) {
    return  '<div class="privacy-status" data-status="' + status + '"><i class="glyphicon glyphicon-lock"></i></div>'
  }
}

var translateDuration = function(dur) {
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
    }
  }
  if( s != '' ) {
    output += s;
  }

  return output;
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

// delete playlist

$('#playlists-list').on('click', '.delete', function() {
  var id = $(this).parents('.item').attr('id'),
      playlistName = $(this).parents('.item').find('.title').text(),
      answer = confirm("Are you sure you want to delete playlist " + playlistName + "? This process is PERMANENT and you can not undo it.");

  if( answer ) {
    removePlaylist(id);
  }
});

// append playlist

$('#playlists-list, #active-playlist').on('click', '.item > a', function() {
  playlistId = $(this).data('id');

  var item = {};
  item.id = playlistId;
  item.thumbnail = $(this).find('img').attr('src');
  item.title = $(this).find('.title').text();
  item.description = $(this).find('.description').text();
  item.status = $(this).parents('.item').find('.privacy-status').data('status');

  $('#playlists').removeClass('in');
  $('#playlist-videos, #active-playlist').addClass('in');

  appendPlaylist(item, true);
  requestVideos(playlistId);
});

// add new playlist
$('.add-new-playlist').on('click', 'a', function(e) {
  e.preventDefault();
  $('#newPlaylistModal').find('input, textarea').val('');
  $('#newPlaylistModal').find('input[type=checkbox]').attr('checked', false);
  addNewPlaylist();
});

//on video
$('#playlist-videos').on('click', 'a', function() {
  var title = $(this).find('.title').text();
  activeVideo = $(this).data('id');
  playVideo();
});

$('#login-link').click(function() {
  checkAuth();
});

$('#newPlaylistModal').find('#playlistName').on('keyup', function() {
  if( $(this).val() == '' ) {
    $('#newPlaylistSubmit').attr('disabled', 'disabled').addClass('btn-danger').removeClass('btn-success');
  } else {
    $('#newPlaylistSubmit').removeAttr('disabled').addClass('btn-success').removeClass('btn-danger');
  }
});

$('#authorizationModal').modal();