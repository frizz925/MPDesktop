export function zeroPadding(text, len) {
    text = text.toString();
    for (var i = 0; i < len - text.length; i++) {
        text = "0" + text;
    }
    return text;
}

export function formattedTime(time) {
    var mins = zeroPadding(Math.floor(time / 60), 2);
    var secs = zeroPadding(Math.floor(time % 60), 2);
    return mins + ":" + secs;
}

export function normalizeTrackNumber(trackno) {
    if (!trackno) return "";
    if (Number.isInteger(trackno)) return zeroPadding(trackno, 2);
    return zeroPadding(Number.parseInt(trackno.match(/\d+/)[0]), 2);
}

export function traverseObject(obj, query, value) {
    var key, parent;
    var keys = query.match(/[^\.]+/g);

    while (keys.length > 0 && obj) {
        key = keys.shift();
        parent = obj;
        obj = parent[key];
    }

    if (value !== undefined) {
        parent[key] = value;
    }

    return obj;
}

export function filename(fn) {
    return fn.match(/([^\/]+)$/).pop();
}
