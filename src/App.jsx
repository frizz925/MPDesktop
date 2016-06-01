import React, { Component } from 'react';
import AppSidebar from 'components/AppSidebar.jsx';
import { grey700 } from 'material-ui/styles/colors';

export default class App extends Component {
    baseStyle = {
        backgroundColor: grey700,
        width: "100%",
        height: "100vh"
    }

    appStyle = {
        marginLeft: "200px"
    }

    render() {
        return (
            <div style={this.baseStyle}>
                <AppSidebar />
                <div style={this.appStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
