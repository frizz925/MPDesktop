import React, { Component } from 'react';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'components/Paper.jsx';

class Output extends Component {
    style = {
        marginTop: "10px",
        marginBottom: "10px"
    }

    render() {
        return (
            <Paper>
                <h3>Output</h3>
                <br />
                {_.map(this.props.outputs, (output, idx) => {
                    var checked = output.outputenabled == 1;
                    return <Checkbox 
                        key={idx}
                        style={this.style}
                        label={output.outputname}
                        defaultChecked={checked}
                        onCheck={this.outputClick(output)} />;
                })}
            </Paper>
        );
    }

    outputClick(output) {
        return (evt, checked) => {
            if (checked) {
                window.mpd.command("enableoutput " + output.outputid);
            } else {
                window.mpd.command("disableoutput " + output.outputid);
            }
        };
    }
}

const mapStateToProps = (state) => ({
    outputs: state.outputs
});

export default connect(mapStateToProps)(Output);
