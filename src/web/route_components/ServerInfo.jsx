import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Component } from 'reactcss';
import Radium from 'radium';
import Paper from 'components/Paper.jsx';
import { zeroPadding, traverseObject } from 'helpers';

class ServerInfo extends Component {
    classes() {
        return {
            'default': {
                block: {
                    display: "inline-block",
                    minWidth: "200px",
                    marginRight: "10px"
                },
                h4: {
                    marginTop: "10px"
                }
            }
        };
    }

    render() {
        return (
            <Paper>
                <h3>Server Info</h3>
                {_.map(stats, (obj, idx) => {
                    var label, name, value, callback;
                    if (_.isObject(obj)) {
                        label = obj.label;
                        name = obj.name;
                        callback = obj.callback;
                    } else {
                        name = obj;
                        label = name.charAt(0).toUpperCase() + name.substring(1);
                    }

                    var value = traverseObject(this.props.stats, name);
                    if (value && callback) value = callback(value);
                    if (Number.isInteger(value)) value = value.toLocaleString();

                    return (
                        <div is="block" key={idx}>
                            <h4 is="h4">{label}</h4>
                            {value}
                        </div>
                    );
                })}
            </Paper>
        );
    }
}

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function parseTime(time) {
    var hours = Math.floor(time / HOUR);
    return zeroPadding(hours, 2) + ":" + moment(time, "X").format("mm:ss");
}

const mapStateToProps = (state) => ({ stats: state.stats });

const stats = [
    {
        label: "MPD Version",
        name: "version",
        callback: (val) => val.join(".")
    },
    "artists", "albums", "songs",
    {
        label: "Songs Playtime",
        name: "db_playtime",
        callback: (time) => {
            var text = [];
            if (time >= DAY) {
                var days = Math.floor(time / DAY);
                text.push(days + " days");
                time -= days * DAY;
            }
            text.push(parseTime(time));
            return text.join(" ");
        }
    },
    {
        label: "Uptime",
        name: "uptime",
        callback: parseTime
    },
    {
        label: "Playtime",
        name: "playtime",
        callback: parseTime
    },
    {
        label: "Last DB Update",
        name: "db_update",
        callback: (time) => {
            return moment(time, "X").fromNow();
        }
    }
];

export default connect(mapStateToProps)(Radium(ServerInfo));
