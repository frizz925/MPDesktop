import React, { Component } from 'react';
import Paper from 'components/Paper.jsx';

import PlaybackControl from 'components/playlist/PlaybackControl.jsx';

export default class Playlist extends Component {
    render() {
        return (
            <div>
                <PlaybackControl />
            </div>
        );
    }
}
