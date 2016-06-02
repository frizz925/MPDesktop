import React, { Component } from 'react';
import Paper from 'components/Paper.jsx';

export default class PlaybackControl extends Component {
    paperStyle = {
        width: "480px"
    }

    render() {
        return (
            <Paper style={this.paperStyle}>
                <h3>Playback</h3>
            </Paper>
        );
    }
}
