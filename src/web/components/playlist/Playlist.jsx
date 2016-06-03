import React from 'react';
import { Component } from 'reactcss';
import { connect } from 'react-redux';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import MaterialIcon from 'components/MaterialIcon.jsx';
import Helper from './Helper';

const styles = {
    'paper': {
        padding: "20px 0"
    },
    'tr': {
        'base': {
            cursor: "pointer",
            transition: "background-color 0.1s ease-out",
            ':hover': {
                backgroundColor: "rgba(0,0,0,0.05)"
            }
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
            textAlign: "center"
        },
        'duration': {
            textAlign: "right"
        }
    },
    'playing': {
        lineHeight: "18px",
        fontSize: "18px"
    }
};

class Playlist extends Component {
    classes() {
        return {
            'default': styles
        }
    }

    render() {
        return (
            <Paper style={this.styles().paper}>
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
                        {_.map(this.props.playlist, (song, idx) => (
                            <tr key={idx} style={this.styles().tr.base}>
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
                    style={this.styles().playing}
                    icon={icon} />;
        } else {
            return "";
        }
    }
}

const mapStateToProps = (state) => _.assign({}, state);
export default connect(mapStateToProps)(Radium(Playlist));
