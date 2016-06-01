import React, { Component } from 'react';
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { open: true };
    }

    handleToggle = () => { this.setState({ open: !this.state.open }) }
    handleChange = (open) => { this.setState({open}) }

    iconStyle = {
        padding: "0 12px 0 0",
        lineHeight: "24px",
        display: "inline-block",
        verticalAlign: "middle"
    }

    textStyle = {
        lineHeight: "24px",
        display: "inline-block",
        verticalAlign: "middle"
    }

    render() {
        return (
            <Drawer
                docked={true}
                width={200}
                open={this.state.open}
                onRequestChange={this.handleChange}>
                {this.menuItem("/", "playlist_play", "Playlist")}
                {this.menuItem("/output", "volume_up", "Output")}
                {this.menuItem("/settings", "settings", "Settings")}
            </Drawer>
        );
    }

    menuItem(path, icon, text) {
        return (
            <Link to={path}>
                <MenuItem>
                    <FontIcon style={this.iconStyle} className="material-icons">{icon}</FontIcon>
                    <span style={this.textStyle}>{text}</span>
                </MenuItem>
            </Link>
        );
    }
}
