import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'components/Paper.jsx';

class Settings extends Component {
    render() {
        return (
            <Paper>
                <h3>Settings</h3>
                <TextField
                    floatingLabelText="Host"
                    hintText="MPD server hostname or IP address"
                    value={this.props.host} />
                <br />
                <TextField
                    floatingLabelText="Port"
                    hintText="MPD server port (default: 6600)"
                    value={this.props.port} />
                <br />
                <TextField
                    floatingLabelText="Password"
                    hintText="MPD server password (if required)"
                    type="password"
                    value={this.props.password} />
                <br />
                <RaisedButton 
                    label="Save"
                    primary={true} />
            </Paper>
        );
    }
}

const mapStateToProps = (state) => {
    return _.assign({}, state.settings);
};
const mapDispatchToProps = (dispatch, props) => {
    return {
        save: () => {
            dispatch({
                type: 'UPDATE_SETTINGS',
                settings: props.settings
            });
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
