import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

import Paper from 'components/Paper.jsx';
import MaterialIcon from 'components/MaterialIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Styles from './styles';
import Events from './events';

import { formattedTime, normalizeTrackNumber, filename } from 'helpers';

const styles = Styles.toObject();

class Playlist extends Component {
    searchTimeout = null;

    constructor(props) {
        super(props);
        this.events = new Events(this);
    }

    render() {
        const events = this.events;

        return (
            <Paper style={styles.paper}>
                <div style={styles.searchWrapper}>
                    <div style={styles.searchFieldWrapper}>
                        <TextField 
                            style={styles.searchField}
                            hintText="Search here"
                            onChange={events.onSearchChange()}
                            defaultValue={this.props.search} />
                    </div>
                    <div style={styles.searchButtonWrapper}>
                        <RaisedButton
                            label="Search"
                            onClick={events.onSearchClicked()} />
                    </div>
                </div>
                <br />
                <table>
                    <tbody>
                        <tr>
                            {this.header("playing", "Playing")}
                            {this.header("track", "Track")}
                            {this.header("artist", "Artist")}
                            {this.header("album", "Album")}
                            {this.header("title", "Title")}
                            {this.header("duration", "Duration")}
                        </tr>
                        {_.map(this.filteredPlaylist(), (song, idx) => (
                            <tr key={idx} style={styles.tr} onClick={events.onSongClicked(song)}>
                                {this.cell("playing", this.playing(song))}
                                {this.cell("track", normalizeTrackNumber(song.Track))}
                                {this.cell("artist", song.Artist)}
                                {this.cell("album", song.Album)}
                                {this.cell("title", song.Title ? song.Title : filename(song.file))}
                                {this.cell("duration", formattedTime(song.Time))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        );
    }

    filteredPlaylist() {
        return this.props.playlist.slice(0, 20);
    }

    header(key, label) {
        var style = styles.th[key] || {};
        return <th key={key} style={style}>{label}</th>;
    }

    cell(key, label) {
        var style = styles.td[key] || {};
        return <td key={key} style={[styles.td.base, style]}>{label}</td>;
    }

    playing(song) {
        if (this.props.song.Id == song.Id) {
            var icon = this.props.status.state == "play" ? "play_arrow" : "pause";
            return <MaterialIcon
                style={styles.playing}
                icon={icon} />;
        } else {
            return "";
        }
    }
}

const mapStateToProps = (state) => _.assign({}, state);
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Playlist));
