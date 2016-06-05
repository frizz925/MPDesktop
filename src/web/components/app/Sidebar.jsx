import React, { Component } from 'react';
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MaterialIcon from 'components/MaterialIcon.jsx';
import routes from 'routes';

export default class Sidebar extends Component {
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
                {_.map(routes, (route) => this.menuItem(route.path, route.icon, route.label))}
            </Drawer>
        );
    }

    menuItem(path, icon, text) {
        return (
            <Link key={path} to={path}>
                <MenuItem>
                    <MaterialIcon style={this.iconStyle} icon={icon} />
                    <span style={this.textStyle}>{text}</span>
                </MenuItem>
            </Link>
        );
    }
}
