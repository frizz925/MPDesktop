export default {};

const AV = window.AV;

var player;

export default {
    storeSubscribe: (state) => {
        if (!player) return;

        var streaming = state.streaming;
        var status = state.status;
        if (status.state == "play") {
            if (streaming.enabled && player.paused) {
                player.play();
            } else if (!streaming.enabled && !player.paused) {
                player.pause();
            }
        } else {
            if (streaming.enabled && !player.paused) {
                player.pause();
            } 
        }
    },
    onSongUpdate: (state) => {
        if (settings.path) {
            player = changeAudioSource(`file://${settings.path}/${song.file}`);
            player.currentTime = playback.current * 1000;
        }
    },
    onSettingsUpdate: (settings) => {
        var streaming = settings.streaming;
        var host = streaming.host || settings.host;
        var path = streaming.path || "/";

        player = changeAudioSource(`http://${host}:${streaming.port}${path}`);
    },
    onStreamingUpdate: (streaming) => {
        player.volume = streaming.volume;
    }
};

function changeAudioSource(src) {
    var paused = player ? player.paused : false;
    player = AV.Player.fromURL(src);
    if (!paused) player.play();
    return player;
}

