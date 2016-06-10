import { updateSearch } from 'actions';

export default class Events {
    values = {}
    value(name, val) {
        if (val !== undefined) this.values[name] = val;
        return this.values[name];
    }

    constructor(component) {
        this.component = component;
        this.props = component.props;
    }

    databind(name) {
        return ((evt, val) => this.value(name, val)).bind(this);
    }

    onSearchChange() {
        return this.databind("search");
    }

    onSearchClicked() {
        return (() => {
            var search = this.value("search");
            this.props.dispatch(updateSearch(search));
        }).bind(this);
    }

    onSongClicked(song) {
        return () => {
            window.mpd.command("play " + song.Pos);
        };
    }
}
