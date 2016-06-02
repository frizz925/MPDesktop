import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from 'components/app/Sidebar.jsx';
import { grey200 } from 'material-ui/styles/colors';

class App extends Component {
    baseStyle = {
        backgroundColor: grey200,
        width: "100%",
        height: "100vh"
    }

    appStyle = {
        marginLeft: "200px",
        padding: "20px"
    }

    render() {
        return (
            <div style={this.baseStyle}>
                <Sidebar />
                <div style={this.appStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default connect(null, null)(App);
