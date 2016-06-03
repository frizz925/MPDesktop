import React from 'react';
import { Component } from 'reactcss';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import Slider from 'material-ui/Slider';
import MaterialIcon from 'components/MaterialIcon.jsx';
import CheckBox from 'material-ui/Checkbox';
import { grey400 } from 'material-ui/styles/colors';

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
        backgroundImage: "url(http://img2-ak.lst.fm/i/u/300x300/8a6a1123bb124e4890f20c956a63e734.png)",
        backgroundSize: "contain"
    },
    'info': {
        'base': {
            textAlign: "center"
        },
        'album': {
            color: grey400
        },
        'artist': {
        }
    },
    'wrapper': {
        display: "table",
        width: "100%"
    },
    'playback': {
        width: "100%"
    },
    'seek': {
        'base': {
            marginTop: "12px",
            fontSize: "10pt"
        },
        'current': {
            'float': "left"
        },
        'duration': {
            'float': "right"
        },
        'slider': {
            marginTop: "-20px"
        }
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
            ':hover': {
                backgroundColor: "rgba(0,0,0,0.05)"
            }
        },
        'shuffle': {
            color: grey400
        },
        'repeat': {
            color: grey400
        }
    },
    'volume': {
        'base': {
            display: "table",
            marginTop: "-8px"
        },
        'icon': {
            padding: "8px",
            cursor: "pointer",
            ':hover': {
                backgroundColor: "rgba(0,0,0,0.05)"
            }
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
    'cls': {
        display: "block",
        clear: "both"
    }
};

class Playback extends Component {
    classes() {
        return {
            'default': styles
        }
    }

    render() {
        return (
            <Paper style={this.styles().paper}>
                <div style={this.styles().wrapper}>
                    <div style={[this.styles().col, this.styles().cover]}></div>
                    <div style={[this.styles().col, this.styles().playback]}>
                        <div style={this.styles().info.base}>
                            <h3 style={this.styles().info.title}>Dream House</h3>
                            <div style={this.styles().info.artist}>Deafheaven</div>
                            <div style={this.styles().info.album}>Sunbather</div>
                        </div>
                        <div style={this.styles().seek.base}>
                            <div style={this.styles().seek.current}>00:00</div>
                            <div style={this.styles().seek.duration}>09:15</div>
                            <div style={this.styles().cls}></div>
                            <Slider style={this.styles().seek.slider} />
                        </div>
                        <div style={this.styles().control.base}>
                            {this.button("shuffle")}
                            {this.button("skip_previous")}
                            {this.button("pause")}
                            {this.button("play_arrow")}
                            {this.button("skip_next")}
                            {this.button("repeat")}
                        </div>
                        <div style={this.styles().volume.base}>
                            <div style={this.styles().volume.iconWrapper}>
                                <MaterialIcon style={this.styles().volume.icon} icon="volume_up" />
                            </div>
                            <Slider 
                                style={this.styles().volume.slider} 
                                min={0}
                                max={100}
                                defaultValue={100} />
                        </div>
                        <div style={this.styles().checkbox.base}>
                            {this.checkBox("Single mode")}
                            {this.checkBox("Consume mode")}
                            <div style={this.styles().cls}></div>
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }

    button(icon) {
        var style = this.styles().control[icon] || {};
        return <MaterialIcon key={icon} style={[this.styles().control.icon, style]} icon={icon} />;
    }

    checkBox(label) {
        return <CheckBox style={this.styles().checkbox.input} label={label} />;
    }
}

export default Radium(Playback);
