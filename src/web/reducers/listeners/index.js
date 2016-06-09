import { normalizeTrackNumber, filename } from 'helpers';
import player from 'player';

export function onSongUpdate(state) {
    const song = state.song;
    const status = state.status;
    const settings = state.settings;
    const playback = state.playback;

    console.log(song);
    var body = song.Title
        ? Artist + " - [" + song.Album + " #" + normalizeTrackNumber(song.Track) + "] " + song.Title
        : filename(song.file);
    document.title = body;

    if (settings.notification && status.state == "play") {
        new Notification("MPDesktop", { body });
    }

    player.onSongUpdate(state);
}

export function onSettingsUpdate(state) {
    player.onSettingsUpdate(state);
    // save settings to localStorage
    localStorage.setItem("settings", JSON.stringify(state.settings));
}

export function onStreamingUpdate(state) {
    player.onStreamingUpdate(state);
}

