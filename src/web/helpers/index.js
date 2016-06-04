export function zeroPadding(text, len) {
    text = text.toString();
    for (var i = 0; i < len - text.length; i++) {
        text = "0" + text;
    }
    return text;
}

export function formattedTime(time) {
    var mins = zeroPadding(Math.floor(time / 60), 2);
    var secs = zeroPadding(time % 60, 2);
    return mins + ":" + secs;
}

export function normalizeTrackNumber(trackno) {
    if (!trackno) return "";
    if (Number.isInteger(trackno)) return zeroPadding(trackno, 2);
    return zeroPadding(trackno.match(/\d+/)[0], 2);
}
