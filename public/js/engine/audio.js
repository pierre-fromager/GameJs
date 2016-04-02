var Audio = {
    path : '/gamejs/public/asset/audio/'
    , name : ''
    , context : null
    , bufferLoader : null
    , playlist : []
    , tracks : []
    , track : null
    , enabled : true
    , init : function(){
        window.AudioContext = window.AudioContext 
            || window.webkitAudioContext 
            || false;
        
        if(window.AudioContext) {
            this.context = new AudioContext();
        } else {
            Audio.enabled = false;
        }
        if (!this.playlist) {
            throw 'Empty playlist use setPlaylist before.';
        }
        if (Audio.enabled) {
            this.bufferLoader = new BufferLoader(
                this.context
                , this.getPathablePlaylist()
                , this.connect
            );
            this.bufferLoader.load();
        }
        
    }
    , connect : function(bufferList){
        for (i = 0; i < bufferList.length; i++){
            var track = Audio.context.createBufferSource();
            track.buffer = bufferList[i];
            track.connect(Audio.context.destination);
            track.loop = false;
            Audio.tracks.push(track);
        }
    }
    , play : function(trackNumber, time) {
        if (Audio.enabled && Audio.tracks[trackNumber]) {
            trackNumber = (trackNumber) ? trackNumber : 0;
            time = (time) ? time : 0;
            Audio.track = Audio.context.createBufferSource();
            Audio.track.buffer = Audio.tracks[trackNumber].buffer;
            Audio.track.connect(Audio.context.destination);
            Audio.track.start(time);
        } else {
            // console.error('Audio not ready');
        }
    }
    , changeTrack : function(trackNumber){
        this.track = this.tracks[trackNumber];
    }
    , setPlaylist : function(playlist) {
        this.playlist = playlist;
    }
    , getPathablePlaylist : function(){
        var path = this.path;
        return this.playlist.map(
            function(v){
                return path + v
            }
        );
    }
}

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = 'arraybuffer';
  var loader = this;
  request.onload = function() {
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.error('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }
  request.onerror = function() {
    console.error('BufferLoader: XHR error');
  }
  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i){
      this.loadBuffer(this.urlList[i], i)
  }
}