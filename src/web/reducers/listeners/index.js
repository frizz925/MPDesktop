import { normalizeTrackNumber } from 'helpers';
import player from 'player';

export function onSongUpdate(state) {
    const song = state.song;
    const settings = state.settings;
    const playback = state.playback;

    console.log(song);
    var body = song.Artist + " - [" + song.Album + " #" + normalizeTrackNumber(song.Track) + "] " + song.Title;
    document.title = body;

    if (settings.notification) {
        new Notification("MPDesktop", { body });
    }

    player.onSongUpdate(state);
}

export function onSettingsUpdate(settings) {
    player.onSettingsUpdate(settings);
    // save settings to localStorage
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function onStreamingUpdate(state) {
    player.onStreamingUpdate(state);
}

