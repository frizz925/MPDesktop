import React, { Component } from 'react';
import Paper from 'components/Paper.jsx';

import PlaybackComponent from 'components/playlist/Playback.jsx';
import PlaylistComponent from 'components/playlist/Playlist.jsx';

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
