import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sidebar from 'components/app/Sidebar.jsx';
import { grey200 } from 'material-ui/styles/colors';
import './App.css';

class App extends Component {
    baseStyle = {
        width: "100%"
    }

    wrapperStyle = {
        position: "relative",
        width: "calc(100% - 200px)",
        //height: "calc(100vh - 60px)",
        height: "100vh",
        marginLeft: "200px",
        backgroundColor: grey200,
        overflow: "auto"
    }

    render() {
        return (
            <div style={this.baseStyle}>
                <Sidebar />
                <div style={this.wrapperStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default connect(null, null)(App);
