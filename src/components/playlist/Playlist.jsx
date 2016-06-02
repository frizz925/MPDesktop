import React from 'react';
import { Component } from 'reactcss';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import MaterialIcon from 'components/MaterialIcon.jsx';

const styles = {
    'paper': {
        padding: "20px 0"
    },
    'tr': {
        'base': {
            cursor: "pointer",
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
            textAlign: "right"
        },
        'duration': {
            textAlign: "right"
        }
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
                        <tr style={this.styles().tr.base}>
                            {this.cell("playing", <MaterialIcon icon="play_arrow" />)}
                            {this.cell("track", "01")}
                            {this.cell("artist", "Deafheaven")}
                            {this.cell("album", "Sunbather")}
                            {this.cell("title", "Dream House")}
                            {this.cell("duration", "09:15")}
                        </tr>
                    </tbody>
                </table>
            </Paper>
        );
    }

    header(key, label) {
        var style = this.styles().th[key] || {};
        return <th key={key} style={[this.styles().tr.base, style]}>{label}</th>;
    }

    cell(key, label) {
        var style = this.styles().td[key] || {};
        return <td key={key} style={style}>{label}</td>;
    }
}

export default Radium(Playlist);
