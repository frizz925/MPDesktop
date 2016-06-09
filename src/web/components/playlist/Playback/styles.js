import { grey400 } from 'material-ui/styles/colors';
import Immutable from 'immutable';

export default Immutable.Map({
    wrapper: {
        display: "table",
        width: "100%"
    },
    cls: {
        display: "block",
        clear: "both"
    },
    col: {
        display: "table-cell",
        verticalAlign: "top",
        marginRight: "20px"
    },
    cover: {
        display: "inline-block",
        width: "300px",
        height: "300px",
        backgroundSize: "contain",
        backgroundPosition: "50% 50%",
        backgroundRepeat: "no-repeat"
    },
    info: {
        base: { textAlign: "center" },
        album: { color: grey400 }
    },
    playback: {
        width: "100%"
    },
    seek: {
        base: {
            marginTop: "12px",
            fontSize: "10pt"
        },
        current: { 'float': "left" },
        duration: { 'float': "right" },
        slider: { marginTop: "-20px" }
    },
    control: {
        base: {
            marginTop: "-30px",
            textAlign: "center"
        },
        icon: {
            fontSize: "28px",
            cursor: "pointer",
            padding: "8px",
        },
        faded: { color: grey400 }
    },
    volume: {
        base: {
            display: "table",
            marginTop: "-8px"
        },
        icon: {
            padding: "8px"
        },
        iconWrapper: {
            display: "table-cell",
            verticalAlign: "top",
            paddingTop: "12px",
            paddingRight: "12px"
        },
        slider: {
            display: "table-cell",
            verticalAlign: "top",
            width: "100%"
        }
    },
    checkbox: {
        base: {
            marginTop: "-24px"
        },
        input: {
            marginTop: "8px"
        }
    }
});
