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
        return {
            'default': {
                'base': {
                    color: "#333",
                    lineHeight: "24px",
                    display: "inline-block",
                    verticalAlign: "middle"
                }
            }
        }
    }

    render() {
        var styles = this.styles().base;
        if (this.props.style) {
            if (Array.isArray(this.props.style)) {
                _.each(this.props.style, (style) => {
                    _.assign(styles, style);
                    this.assignHover(styles, style);
                });
            } else {
                _.assign(styles, this.props.style);
                this.assignHover(styles, this.props.style);
            }
        }

        return <FontIcon 
                    style={styles} 
                    onMouseEnter={this.enableHover.bind(this)} 
                    onMouseLeave={this.disableHover.bind(this)}
                    className="material-icons">
                        {this.props.icon}
                </FontIcon>
    }

    assignHover(styles, style) {
        if (!this.state.hover) return;
        if (!style[':hover']) return;
        _.assign(styles, style[':hover']);
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

