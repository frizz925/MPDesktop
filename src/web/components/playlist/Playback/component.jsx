import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import MaterialIcon from 'components/MaterialIcon';
import Paper from 'components/Paper';
import Styles from './styles';

import { formattedTime, filename } from 'helpers';
import { updateSeek, updateVolume, setStreaming, setStreamingVolume } from 'actions';

const styles = Styles.toObject();

class Playback extends Component {
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
            <Paper>
                <div style={styles.wrapper}>
                    <div style={[styles.col, styles.cover, coverImageStyle]}></div>
                    <div style={[styles.col, styles.playback]}>
                        <div style={styles.info.base}>
                            <h3 style={styles.info.title}>{song.Title ? song.Title : song.file ? filename(song.file) : ""}</h3>
                            <div style={styles.info.artist}>{song.Artist}</div>
                            <div style={styles.info.album}>{song.Album}</div>
                        </div>
                        <div style={styles.seek.base}>
                            <div style={styles.seek.current}>{formattedTime(time)}</div>
                            <div style={styles.seek.duration}>{duration}</div>
                            <div style={styles.cls}></div>
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
                            {this.checkbox("Single mode", "single", status.single == 1)}
                            {this.checkbox("Consume mode", "consume", status.consume == 1)}
                            {this.checkbox("Streaming", this.toggleStream.bind(this), streaming.enabled)}
                            <div style={styles.cls}></div>
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
        if (streaming.enabled) volume = streaming.volume;
        return volume;
    }

    toggleStream(evt, val) {
        this.props.setStreaming(val);
    }

    volumeChange(evt, val) {
        var status = this.props.status;
        var streaming = this.props.streaming;
        if (streaming.enabled) {
            this.props.setStreamingVolume(val);
        } else {
            if (status.volume >= 0) {
                this.props.updateVolume(val);
                this.timeoutChange('volume', 200, () => {
                    window.mpd.command("setvol " + Math.round(val));
                });
            }
        }
    }

    seekChange(evt, val) {
        var playback = this.props.playback;
        var time = val / 1000 * playback.duration;
        this.props.updateSeek(time);
        this.timeoutChange('seek', 200, () => {
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

    checkbox(label, command, checked) {
        if (checked === undefined) checked = false;

        var onCheck = _.isString(command) ?
            this.buttonClick(command + " " + (checked ? 0 : 1)) :
            command;

        return <Checkbox
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
    setStreaming: (state) => dispatch(setStreaming(state)),
    setStreamingVolume: (volume) => dispatch(setStreamingVolume(volume))
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Playback));
