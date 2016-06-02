import React, { Component } from 'react';
import BasePaper from 'material-ui/Paper';

export default class Paper extends Component {
    constructor(props) {
        super(props);
        this.paperStyle = {
            padding: "20px"
        };

        if (props.style) {
            _.assign(this.paperStyle, props.style);
        }
    }

    render() {
        return <BasePaper style={this.paperStyle}>{this.props.children}</BasePaper>;
    }
}
