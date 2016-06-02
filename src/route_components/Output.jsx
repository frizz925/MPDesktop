import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'components/Paper.jsx';

export default class Output extends Component {
    render() {
        return (
            <Paper>
                <h3>Output</h3>
                <br />
                <Checkbox label="My ALSA device" />
            </Paper>
        );
    }
}
