import React, { Component } from 'react';
import Paper from 'components/Paper';

import PlaybackComponent from 'components/playlist/Playback';
import PlaylistComponent from 'components/playlist/Playlist';

export default class Playlist extends Component {
    playlistStyle = {
        minWidth: "740px"
    }

    render() {
        return (
            <div style={this.playlistStyle}>
                <PlaybackComponent />
                <PlaylistComponent />
            </div>
        );
    }
}
