import React from 'react';
import { Component } from 'reactcss';
import FontIcon from 'material-ui/FontIcon';

export default class MaterialIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
    }

    classes() {
        var classes = {
            'default': {
                'base': {
                    color: "#333",
                    lineHeight: "24px",
                    display: "inline-block",
                    verticalAlign: "middle"
                }
            },
            'hovered': {
                'base': {}
            }
        }

        if (this.props.style) {
            if (Array.isArray(this.props.style)) {
                _.each(this.props.style, (style) => this.applyStyle(classes, "base", style));
            } else {
                this.applyStyle(classes, "base", this.props.style);
            }
        }

        return classes;
    }

    applyStyle(classes, name, style) {
        _.assign(classes.default[name], style);
        if (style[':hover']) {
            _.assign(classes.hovered[name], style[':hover']);
        }
    }

    styles() {
        return this.css({
            'hovered': this.state.hover
        });
    }

    render() {
        return <FontIcon 
                    style={this.styles().base} 
                    onMouseEnter={this.enableHover.bind(this)} 
                    onMouseLeave={this.disableHover.bind(this)}
                    className="material-icons">
                        {this.props.icon}
                </FontIcon>
    }

    enableHover() {
        this.setState({
            hover: true
        });
    }

    disableHover() {
        this.setState({
            hover: false
        });
    }
}

