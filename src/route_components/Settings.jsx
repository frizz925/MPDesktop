import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'components/Paper.jsx';

class Settings extends Component {
    textFieldStyle = {
        marginRight: "20px"
    }

    render() {
        return (
            <Paper>
                <h3>Settings</h3>
                {this.textField("Host", "MPD server hostname or IP address", this.props.host)}
                {this.textField("Port", "MPD server port (default: 6600)", this.props.port)}
                {this.textField("Password", "MPD server password (if required)", this.props.password)}
                <br />
                <RaisedButton 
                    label="Save"
                    primary={true} />
            </Paper>
        );
    }

    textField(label, hint, value, type) {
        return (
            <div>
                <TextField
                    style={this.textFieldStyle}
                    floatingLabelText={label}
                    hintText={hint}
                    value={value}
                    type={type || "text"} />
            </div>
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
