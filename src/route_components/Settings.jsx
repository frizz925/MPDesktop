import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Settings extends Component {
    render() {
        return (
            <div>
                <h3>Connection Settings</h3>
                <TextField
                    floatingLabelText="Host"
                    hintText="MPD server hostname or IP address" />
                <br />
                <TextField
                    floatingLabelText="Port"
                    hintText="MPD server port (default: 6600)" />
                <br />
                <TextField
                    floatingLabelText="Password"
                    hintText="MPD server password (if required)" />
                <br />
                <RaisedButton label="Save" />
            </div>
        );
    }
}
