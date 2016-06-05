import { normalizeTrackNumber } from 'helpers';

export function onSongUpdate(state) {
    const song = state.song;
    const settings = state.settings;

    console.log(song);
    var body = song.Artist + " - [" + song.Album + " #" + normalizeTrackNumber(song.Track) + "] " + song.Title;
    document.title = body;

    if (settings.notification) {
        new Notification("MPDesktop", { body });
    }
}

export function onSettingsUpdate(settings) {
    var streaming = settings.streaming;
    var host = streaming.host || settings.host;
    var path = streaming.path || "/";

    var paused = window.audio.paused;
    window.source.src = `http://${host}:${streaming.port}${path}`;
    window.audio.load();
    if (!paused) window.audio.play();

    // save settings to localStorage
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function onStreamingUpdate(state) {
    window.audio.volume = state.volume;
}

