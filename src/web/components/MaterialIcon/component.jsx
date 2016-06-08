import React, { Component } from 'react';
import Radium from 'radium';
import FontIcon from 'material-ui/FontIcon';
import Styles from './styles';

class MaterialIcon extends Component {
    styles() {
        var base = _.assign({}, Styles.toObject());
        var styles = this.props.style;

        if (styles) {
            styles = Array.isArray(styles) ? styles : [ styles ];
            _.each(styles, (style) => {
                _.merge(base, style);
            });
        }

        return base;
    }

    render() {
        var styles = this.styles();
        return <FontIcon 
            style={styles} 
            onClick={this.props.onClick || function() { }}
            className="material-icons">{this.props.icon}</FontIcon>
    }
}

export default Radium(MaterialIcon);
