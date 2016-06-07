export default class Proxy {
    type = "html5";
    players = {};

    player() {
        switch (this.type) {
            case "html5":
                return window.audio;
            default:
                return this.players[this.type];
        }
    }

    playing() {
        var player = this.player();
        switch (this.type) {
            case "html5":
                return !player.paused;
            default:
                return player.playing;
        }
    }

    ready() {
        switch (this.type) {
            case "html5":
                return window.source.src !== undefined;
            default:
                return this.players[this.type];
        }
    }

    volume(volume) {
        var player = this.player();
        if (volume) {
            switch (this.type) {
                case "html5":
                    player.volume = volume / 100;
                    break;
                default:
                    player.volume = volume;
                    break;
            }
        }

        switch (this.type) {
            case "html5":
                return player.volume * 100;
            default:
                return player.volume;
        }
    }

    src(src, seek) {
        if (src) {
            this._src = src;

            var playing = this.playing();
            if (playing) this.stop();

            var readyCallback = () => {
                if (playing) this.play();
                if (seek) this.seek(seek);
            }

            switch (this.type) {
                case "html5":
                    window.source.src = src;
                    window.audio.load();
                    readyCallback();
                    break;
                case "aurora":
                    var player = this.players.aurora = AV.Player.fromURL(src);
                    player.on('ready', readyCallback);
                    break;
            }

        }

        switch (this.type) {
            case "html5":
                return window.source.src;
            default:
                return this._src;
        }
    }

    play() {
        this.player().play();
        return this;
    }

    pause() {
        this.player().pause();
        return this;
    }

    stop() {
        var player = this.player();
        switch (this.type) {
            case "html5":
                player.pause();
                player.currentTime = 0;
                break;
            default:
                player.stop();
                break;
        }
        return this;
    }

    seek(time) {
        var player = this.player();
        if (time) {
            switch (this.type) {
                case "html5":
                    player.currentTime = time;
                    break;
                default:
                    player.seek(time * 1000);
                    break;
            }
        }

        switch (this.type) {
            case "html5":
                return player.currentTime;
            default:
                return player.currentTime / 1000;
        }
    }
}

