import Proxy from './_proxy';
const AV = window.AV;
const player = new Proxy();

const callbacks = {
    storeSubscribe: (state) => {
        if (!player.ready()) return;

        var streaming = state.streaming;
        var status = state.status;
        if (status.state == "play") {
            if (streaming.enabled && !player.playing()) {
                player.play();
            } else if (!streaming.enabled && player.playing()) {
                player.pause();
            }
        } else {
            if (streaming.enabled && player.playing()) {
                player.pause();
            } 
        }
    },
    onSongUpdate: (state) => {
        updateAudioStream(state);
    },
    onSettingsUpdate: (state) => {
        updateAudioStream(state);
    },
    onStreamingUpdate: (streaming) => {
        player.volume(streaming.volume);
    },
    init: (state) => {
        callbacks.onSettingsUpdate(state);
    }
};

function updateAudioStream(state) {
    var song = state.song;
    var settings = state.settings;
    var playback = state.playback;
    var cover = settings.cover;
    var streaming = settings.streaming;

    var src;
    /*
    // Deprecated
    if (streaming.local) {
        if (!song.file) return;
        src = `file://${settings.path}/${song.file}`;
        player.src(src, playback.current);
    } else if (cover.enabled) {
        var host = cover.host || settings.host;
        var port = cover.port || 80;
        var path = cover.path || "";
        src = `http://${host}:${port}${path}/${song.file}`;
    } else {
    */
        var host = streaming.host || settings.host;
        var path = streaming.path || "/";
        src = `http://${host}:${streaming.port}${path}`;
        player.src(src);
    //}
}

export default callbacks;
