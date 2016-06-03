import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import 'normalize-css';

import App from './App.jsx';
import Playlist from 'route_components/Playlist.jsx';
import Output from 'route_components/Output.jsx';
import Settings from 'route_components/Settings.jsx';

injectTapEventPlugin();

const backend = window.backend;
const settings = {
    host: "localhost",
    port: 6600
};

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.blueGrey500,
        primary2Color: Colors.blueGrey700
    }
});

const store = createStore((state, action) => {
    switch (action.type) {
        case 'UPDATE_STATUS':
            state.status = action.status;
            break;
        case 'UPDATE_PLAYLIST':
            state.playlist = action.playlist;
            break;
        case 'UPDATE_SETTINGS':
            state.settings = action.settings;
            break;
        case 'UPDATE_SONG':
            state.song = action.song;
            break;
        default:
            return state;
    }
    return _.assign({}, state);
}, {
    song: {},
    status: {},
    playlist: [],
    settings
});

backend.connect(settings.host, settings.port, function(resp) {
    backend.command("status", function(status) {
        console.log(status);
        store.dispatch({
            type: 'UPDATE_STATUS',
            status
        });
    });

    backend.command("currentsong", function(song) {
        console.log(song);
        store.dispatch({
            type: 'UPDATE_SONG',
            song
        });
    });

    backend.command("playlistinfo", function(playlist) {
        console.log(playlist);
        store.dispatch({
            type: 'UPDATE_PLAYLIST',
            playlist
        });
    });
});

render((
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Playlist} />
                    <Route path="/output" component={Output} />
                    <Route path="/settings" component={Settings} />
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>
), document.getElementById("root"));

