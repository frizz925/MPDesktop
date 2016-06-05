import React from 'react';
import Radium from 'radium';
import { Component } from 'reactcss';
import { connect } from 'react-redux';
import Paper from 'components/Paper.jsx';
import MaterialIcon from 'components/MaterialIcon.jsx';
import TextField from 'material-ui/TextField';

import { formattedTime, normalizeTrackNumber } from 'helpers';
import { updateSearch } from 'actions';

class Playlist extends Component {
    searchTimeout = null;

    classes() {
        return {
            'default': {
                'paper': {
                    padding: "20px 0"
                },
                'searchWrapper': {
                    padding: "20px"
                },
                'searchField': {
                    width: "100%"
                },
                'tr': {
                    cursor: "pointer",
                },
                'playing': {
                    fontSize: "18px"
                }
            }
        };
    }

    render() {
        return (
            <Paper is="paper">
                <div is="searchWrapper">
                    <TextField 
                        is="searchField"
                        hintText="Search here"
                        onChange={this.doSearch.bind(this)} />
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
                            <tr key={idx} is="tr" onClick={this.rowClick(song)}>
                                {this.cell("playing", this.playing(song))}
                                {this.cell("track", normalizeTrackNumber(song.Track))}
                                {this.cell("artist", song.Artist)}
                                {this.cell("album", song.Album)}
                                {this.cell("title", song.Title)}
                                {this.cell("duration", formattedTime(song.Time))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        );
    }

    doSearch(evt, text) {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.props.updateSearch(text);
        }, 500);
    }

    filteredPlaylist() {
        return this.props.playlist.slice(0, 20);
    }

    rowClick(song) {
        return () => {
            window.mpd.command("play " + song.Pos);
        };
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
                is="playing"
                icon={icon} />;
        } else {
            return "";
        }
    }
}

const mapStateToProps = (state) => _.assign({}, state);
const mapDispatchToProps = (dispatch) => ({
    updateSearch: (search) => {
        dispatch(updateSearch(search));
    }
});

const styles = {
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
        'base': {
            verticalAlign: "middle"
        },
        'playing': {
            textAlign: "center",
            padding: 0
        },
        'track': {
            textAlign: "right"
        },
        'duration': {
            textAlign: "right"
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Playlist));
