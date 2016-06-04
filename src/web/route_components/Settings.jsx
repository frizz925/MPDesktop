import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'components/Paper.jsx';

const settings = {};

class Settings extends Component {
    constructor(props) {
        super(props);
        _.assign(settings, props.settings);
    }

    textFieldStyle = {
        marginRight: "20px"
    }

    render() {
        return (
            <Paper>
                <h3>Settings</h3>
                {this.textField("Host", "MPD server hostname or IP address", 'host')}
                {this.textField("Port", "MPD server port (default: 6600)", 'port')}
                {this.textField("Password", "MPD server password (if required)", 'password', 'password')}
                <br />
                <RaisedButton 
                    label="Save"
                    primary={true}
                    onClick={this.props.save} />
            </Paper>
        );
    }

    textField(label, hint, name, type) {
        return (
            <div>
                <TextField
                    style={this.textFieldStyle}
                    floatingLabelText={label}
                    hintText={hint}
                    defaultValue={this.props.settings[name]}
                    onChange={this.handleChange(name).bind(this)}
                    type={type || "text"} />
            </div>
        );
    }

    handleChange(name) {
        return (evt, val) => {
            settings[name] = val;
        };
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings
});

const mapDispatchToProps = (dispatch, props) => {
    return {
        save: () => {
            dispatch({
                type: 'UPDATE_SETTINGS',
                settings
            });

            if (window.mpd.connected) {
                window.mpd.disconnect();
            } else {
                window.connectMPD();
            }
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
