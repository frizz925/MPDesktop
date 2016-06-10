import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'components/Paper';
import { updateSettings } from 'actions';
import { traverseObject } from 'helpers';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = _.assign({}, props.settings);
    }

    render() {
        return (
            <Paper>
                <div style={styles.block}>
                    <h3>MPD</h3>
                    {this.textField("Host", "MPD server hostname", 'host')}
                    {this.textField("Port", "MPD server port (default: 6600)", 'port', { cast: Number })}
                    {this.textField("Password", "MPD server password (optional)", 'password', { type: 'password' })}
                    {this.textField("Directory", "MPD server music directory (optional)", 'path')}
                </div>
                <div style={styles.block}>
                    <h3>Cover Art</h3>
                    {this.groupedTextFields({
                        disabled: !this.state.cover.enabled
                    }, [
                        {
                            label: "Host",
                            hint: "Web server hostname (optional)",
                            name: "cover.host"
                        },
                        {
                            label: "Port",
                            hint: "Web server port (default: 80)",
                            name: "cover.port",
                            cast: Number
                        },
                        {
                            label: "Path",
                            hint: "Path on web server (default: '/cover-art')",
                            name: "cover.path"
                        },
                        {
                            label: "Filename",
                            hint: "Cover filename (default: 'Cover.jpg')",
                            name: "cover.name"
                        }
                    ])}
                    {this.checkbox("Use web server", "cover.enabled")}
                </div>
                <div style={styles.block}>
                    <h3>Streaming</h3>
                    {this.textField("Streaming host", "Streaming server hostname (optional)", "streaming.host")}
                    {this.textField("Streaming port", "Streaming server port (default: 8000)", "streaming.port", { cast: Number })}
                    {this.textField("Streaming URL suffix", "URL suffix on streaming server (optional)", "streaming.suffix")}
                    {/* this.checkbox("Stream locally", "streaming.local") */} 
                </div>
                <div style={styles.block}>
                    <h3>Notification</h3>
                    {this.checkbox("Show notification", "notification")}
                </div>
                <div>
                    <RaisedButton 
                        label="Save"
                        primary={true}
                        onClick={this.save.bind(this)} />
                </div>
            </Paper>
        );
    }

    save() {
        this.props.saveSettings(this.state);
    }

    groupedTextFields(opt = {}, fields) {
        return (
            <div>
                {_.map(fields, (field) => this.textField(field.label, field.hint, field.name, opt))}
            </div>
        );
    }

    textField(label, hint, name, opt = {}) {
        opt.type = opt.type || "text";
        return (
            <div key={name}>
                <TextField
                    style={styles.textField}
                    floatingLabelText={label}
                    hintText={hint}
                    defaultValue={traverseObject(this.state, name)}
                    onChange={this.handleChange(name, opt.cast).bind(this)}
                    {...opt} />
            </div>
        );
    }

    checkbox(label, name) {
        return <Checkbox
            style={styles.checkbox}
            key={name}
            label={label}
            defaultChecked={traverseObject(this.state, name)}
            onCheck={this.handleChange(name, Boolean).bind(this)} />
    }

    handleChange(query, caster) {
        return (evt, val) => {
            var state = _.assign({}, this.state);
            if (caster) {
                if (!isNaN(val)) val = caster(val);
            }
            traverseObject(state, query, val);
            this.setState(state);
        };
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings
});

const mapDispatchToProps = (dispatch, props) => ({
    saveSettings: (settings) => {
        dispatch(updateSettings(settings));

        if (window.mpd.connected) {
            window.mpd.disconnect();
        } else {
            window.connectMPD();
        }
    }
});

const styles = {
    textField: {
        width: "100%",
        marginRight: "20px"
    },
    checkbox: {
        marginTop: "10px",
        marginBottom: "10px"
    },
    block: {
        maxWidth: "280px",
        marginRight: "20px",
        marginBottom: "20px",
        width: "100%",
        display: "inline-block",
        verticalAlign: "top"
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
