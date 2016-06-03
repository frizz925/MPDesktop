import React from 'react';
import { Component } from 'reactcss';
import { connect } from 'react-redux';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import Slider from 'material-ui/Slider';
import MaterialIcon from 'components/MaterialIcon.jsx';
import CheckBox from 'material-ui/Checkbox';
import Helper from './Helper';
import { grey400 } from 'material-ui/styles/colors';

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

        var time = playback.current;
        var maxTime = song.Time || 1000;
        var progress = time / maxTime * 1000;
        var duration = playback.duration > 0 ? Helper.formattedTime(playback.duration) : "--:--";

        return (
            <Paper is="paper">
                <div is="wrapper">
                    <div style={[styles.col, styles.cover, { backgroundImage: "url(" + playback.image_url + ")"  }]}></div>
                    <div style={[styles.col, styles.playback]}>
                        <div style={styles.info.base}>
                            <h3 style={styles.info.title}>{song.Title}</h3>
                            <div style={styles.info.artist}>{song.Artist}</div>
                            <div style={styles.info.album}>{song.Album}</div>
                        </div>
                        <div style={styles.seek.base}>
                            <div style={styles.seek.current}>{Helper.formattedTime(time)}</div>
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
                                style={styles.volume.slider} 
                                min={0}
                                max={100}
                                defaultValue={100}
                                value={status.volume}
                                onChange={this.volumeChange.bind(this)}/>
                        </div>
                        <div style={styles.checkbox.base}>
                            {this.checkBox("Single mode", "single", status.single)}
                            {this.checkBox("Consume mode", "consume", status.consume)}
                            <div is="cls"></div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }

    volumeChange(evt, val) {
        window.mpd.command("setvol " + Math.floor(val));
    }

    seekChange(evt, val) {
        var playback = this.props.playback;
        var time = val / 1000 * playback.duration;
        window.mpd.command(this.seek(time));
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
        return "seek " + this.props.song.Pos + " " + Math.floor(time);
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
        return <CheckBox 
            style={styles.checkbox.input} 
            label={label}
            defaultChecked={checked}
            onCheck={this.buttonClick(command + " " + (checked ? 0 : 1))} />;
    }

    buttonClick(command) {
        return () => {
            window.mpd.command(command);
        };
    }
}

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
        backgroundSize: "contain"
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

const mapStateToProps = (state) => ({
    song: state.song,
    status: state.status,
    playback: state.playback
});

export default connect(mapStateToProps)(Radium(Playback));
