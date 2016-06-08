import Immutable from 'immutable';

export default Immutable.Map({
    paper: {
        padding: "20px 0"
    },
    searchWrapper: {
        display: "table",
        padding: "20px"
    },
    searchFieldWrapper: {
        display: "table-cell",
        verticalAlign: "middle",
        width: "100%"
    },
    searchField: {
        width: "100%"
    },
    searchButtonWrapper: {
        display: "table-cell",
        verticalAlign: "bottom",
        paddingLeft: "20px",
        width: "30px"
    },
    tr: {
        cursor: "pointer",
    },
    th: {
        playing: {
            width: "20px"
        },
        track: {
            width: "20px"
        },
        duration: {
            textAlign: "right"
        }
    },
    td: {
        base: {
            verticalAlign: "middle"
        },
        playing: {
            textAlign: "center",
            padding: 0
        },
        track: {
            textAlign: "right"
        },
        duration: {
            textAlign: "right"
        }
    },
    playing: {
        fontSize: "18px"
    }
});
