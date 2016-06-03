import React from 'react';
import { Component } from 'reactcss';
import { connect } from 'react-redux';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import MaterialIcon from 'components/MaterialIcon.jsx';
import TextField from 'material-ui/TextField';
import Helper from './Helper';

const styles = {
    'paper': {
        padding: "20px 0"
    },
    'tr': {
        'base': {
            cursor: "pointer",
        }
    },
    'th': {
        'playing': {
            width: "20px"
        },
        'track': {
            width: "20px"
        },
        'duration': {
            textAlign: "right"
        }
    },
    'td': {
        'playing': {
            textAlign: "center"
        },
        'track': {
            textAlign: "right"
        },
        'duration': {
            textAlign: "right"
        }
    },
    'playing': {
        lineHeight: "18px",
        fontSize: "18px"
    },
    'searchWrapper': {
        padding: "20px"
    },
    'searchField': {
        width: "100%"
    }
};

var searchTimeout;
class Playlist extends Component {
    doSearch = (evt, text) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            window.mpd.command("playlistsearch any \"" + text.toLowerCase() + "\"", (playlist) => {
                this.props.updatePlaylist(playlist);
            });
        }, 500);
    }

    classes() {
        return {
            'default': styles
        }
    }

    render() {
        return (
            <Paper is="paper">
                <div is="searchWrapper">
                    <TextField 
                        is="searchField"
                        hintText="Search here"
                        onChange={this.doSearch} />
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
                            <tr key={idx} style={this.styles().tr.base} onClick={this.rowClick(song)}>
                                {this.cell("playing", this.playing(song))}
                                {this.cell("track", song.Track)}
                                {this.cell("artist", song.Artist)}
                                {this.cell("album", song.Album)}
                                {this.cell("title", song.Title)}
                                {this.cell("duration", Helper.formattedTime(song.Time))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        );
    }

    filteredPlaylist() {
        return this.props.playlist;
    }

    rowClick(song) {
        return () => {
            window.mpd.command("play " + song.Pos);
        };
    }

    header(key, label) {
        var style = this.styles().th[key] || {};
        return <th key={key} style={style}>{label}</th>;
    }

    cell(key, label) {
        var style = this.styles().td[key] || {};
        return <td key={key} style={style}>{label}</td>;
    }

    playing(song) {
        if (this.props.song.Id == song.Id) {
            var icon = this.props.status.state == "play" ? "play_arrow" : "pause";
            return <MaterialIcon
                is="playing"
                icon={icon} />;
        } else {
            return "";
        }
    }
}

const mapStateToProps = (state) => _.assign({}, state);
const mapDispatchToProps = (dispatch) => ({
    updatePlaylist: (playlist) => {
        dispatch({
            type: "UPDATE_PLAYLIST",
            playlist: _.slice(playlist, 0, 20)
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Playlist));
