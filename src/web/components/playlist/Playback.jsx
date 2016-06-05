import React from 'react';
import { Component } from 'reactcss';
import { connect } from 'react-redux';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import Slider from 'material-ui/Slider';
import MaterialIcon from 'components/MaterialIcon.jsx';
import CheckBox from 'material-ui/Checkbox';
import { formattedTime } from 'helpers';
import { grey400 } from 'material-ui/styles/colors';
import { updateSeek, updateVolume, setStreaming } from 'actions';

class Playback extends Component {
    classes() {
        return {
            'default': {
                'wrapper': {
                    display: "table",
                    width: "100%"
                },
                'cls': {
                    display: "block",
                    clear: "both"
                }
            }
        };
    }

    render() {
        var song = this.props.song;
        var status = this.props.status;
        var playback = this.props.playback;
        var streaming = this.props.streaming;

        var time = playback.current;
        var maxTime = song.Time || 1000;
        var progress = time / maxTime * 1000;
        var duration = playback.duration > 0 ? formattedTime(playback.duration) : "--:--";

        var coverImageStyle = {
            backgroundImage: `url("${playback.cover}")`
        };

        return (
            <Paper is="paper">
                <div is="wrapper">
                    <div style={[styles.col, styles.cover, coverImageStyle]}></div>
                    <div style={[styles.col, styles.playback]}>
                        <div style={styles.info.base}>
                            <h3 style={styles.info.title}>{song.Title}</h3>
                            <div style={styles.info.artist}>{song.Artist}</div>
                            <div style={styles.info.album}>{song.Album}</div>
                        </div>
                        <div style={styles.seek.base}>
                            <div style={styles.seek.current}>{formattedTime(time)}</div>
                            <div style={styles.seek.duration}>{duration}</div>
                            <div is="cls"></div>
                            <Slider 
                                min={0}
                                max={1000}
                                style={styles.seek.slider}
                                defaultValue={0}
                                value={progress}
                                onChange={this.seekChange.bind(this)}/>
                        </div>
                        <div style={styles.control.base}>
                            {this.buttonToggle("shuffle", "random", status.random)}
                            {this.button("skip_previous", "previous")}
                            {this.buttonSeek("fast_rewind", -5)}
                            {this.button("pause", "pause 1", status.state == "play")}
                            {this.button("play_arrow", "play", status.state != "play")}
                            {this.buttonSeek("fast_forward", 5)}
                            {this.button("skip_next", "next")}
                            {this.buttonToggle("repeat", "repeat", status.repeat)}
                        </div>
                        <div style={styles.volume.base}>
                            <div style={styles.volume.iconWrapper}>
                                <MaterialIcon style={styles.volume.icon} icon="volume_up" />
                            </div>
                            <Slider 
                                disabled={!this.stateVolume()}
                                style={styles.volume.slider} 
                                min={0}
                                max={100}
                                defaultValue={100}
                                value={this.getVolume()}
                                onChange={this.volumeChange.bind(this)}/>
                        </div>
                        <div style={styles.checkbox.base}>
                            {this.checkBox("Single mode", "single", status.single)}
                            {this.checkBox("Consume mode", "consume", status.consume)}
                            {this.checkBox("Streaming", this.toggleStream.bind(this), streaming.enabled)}
                            <div is="cls"></div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }

    stateVolume() {
        var status = this.props.status;
        var streaming = this.props.streaming;
        return streaming.enabled || status.volume >= 0;
    }

    getVolume() {
        var status = this.props.status;
        var streaming = this.props.streaming;
        var volume = status.volume > 0 ? status.volume : 0;
        if (streaming.enabled) volume = Math.round(streaming.volume * 100);
        return volume;
    }

    toggleStream(evt, val) {
        this.props.setStreaming(val);
    }

    volumeChange(evt, val) {
        var status = this.props.status;
        var streaming = this.props.streaming;
        if (streaming.enabled) {
            this.props.setStreamingVolume(streaming.volume / 100);
        } else {
            if (status.volume >= 0) {
                this.props.updateVolume(val);
                this.timeoutChange('volume', 500, () => {
                    window.mpd.command("setvol " + Math.round(val));
                });
            }
        }
    }

    seekChange(evt, val) {
        var playback = this.props.playback;
        var time = val / 1000 * playback.duration;
        this.props.updateSeek(time);
        this.timeoutChange('seek', 500, () => {
            window.mpd.command(this.seek(time));
        });
    }

    timeouts = {};
    timeoutChange(name, duration, callback) {
        if (this.timeouts[name]) clearTimeout(this.timeouts[name]);
        this.timeouts[name] = setTimeout(callback, duration);
    }

    buttonToggle(icon, command, state) {
        state = state == 1;
        return <MaterialIcon
                key={icon}
                onClick={this.buttonClick(command + " " + (state ? 0 : 1))}
                style={[styles.control.icon, !state && styles.control.faded]}
                icon={icon} />
    }

    buttonSeek(icon, mod) {
        var playback = this.props.playback;
        var time = playback.current + mod;
        return this.button(icon, this.seek(time));
    }

    seek(time) {
        return "seek " + this.props.song.Pos + " " + Math.round(time);
    }

    button(icon, command, state) {
        if (state === undefined) state = true;
        if (state) {
            var style = styles.control[icon] || {};
            return <MaterialIcon 
                key={icon} 
                onClick={this.buttonClick(command)}
                style={[styles.control.icon, style]} 
                icon={icon} />;
        } else {
            return "";
        }
    }

    checkBox(label, command, checked) {
        if (checked === undefined) checked = false;
        if (Number.isInteger(checked)) checked = checked == 1;

        var onCheck = _.isString(command) ?
            this.buttonClick(command + " " + (checked ? 0 : 1)) :
            command;

        return <CheckBox 
            style={styles.checkbox.input} 
            label={label}
            defaultChecked={checked}
            onCheck={onCheck} />;
    }

    buttonClick(command) {
        return () => {
            window.mpd.command(command);
        };
    }
}

const mapStateToProps = (state) => ({
    song: state.song,
    status: state.status,
    playback: state.playback,
    streaming: state.streaming
});

const mapDispatchToProps = (dispatch) => ({
    updateSeek: (seek) => dispatch(updateSeek(seek)),
    updateVolume: (volume) => dispatch(updateVolume(volume)),
    setStreaming: (state) => dispatch(setStreaming(state))       
});

const styles = {
    'col': {
        display: "table-cell",
        verticalAlign: "top",
        marginRight: "20px"
    },
    'cover': {
        display: "inline-block",
        width: "300px",
        height: "300px",
        backgroundSize: "contain",
        backgroundPosition: "50% 50%",
        backgroundRepeat: "no-repeat"
    },
    'info': {
        'base': { textAlign: "center" },
        'album': { color: grey400 }
    },
    'playback': {
        width: "100%"
    },
    'seek': {
        'base': {
            marginTop: "12px",
            fontSize: "10pt"
        },
        'current': { 'float': "left" },
        'duration': { 'float': "right" },
        'slider': { marginTop: "-20px" }
    },
    'control': {
        'base': {
            marginTop: "-30px",
            textAlign: "center"
        },
        'icon': {
            fontSize: "28px",
            cursor: "pointer",
            padding: "8px",
        },
        'faded': { color: grey400 }
    },
    'volume': {
        'base': {
            display: "table",
            marginTop: "-8px"
        },
        'icon': {
            padding: "8px"
        },
        'iconWrapper': {
            display: "table-cell",
            verticalAlign: "top",
            paddingTop: "12px",
            paddingRight: "12px"
        },
        'slider': {
            display: "table-cell",
            verticalAlign: "top",
            width: "100%"
        }
    },
    'checkbox': {
        'base': {
            marginTop: "-24px"
        },
        'input': {
            marginTop: "8px"
        }
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Playback));
