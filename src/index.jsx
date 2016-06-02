import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { render } from 'react-dom';
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

_.extend(darkBaseTheme.palette, {
    primary1Color: Colors.blueGrey200,
    primary2Color: Colors.blueGrey400
});
const muiTheme = getMuiTheme(darkBaseTheme);

render((
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Playlist} />
                <Route path="/output" component={Output} />
                <Route path="/settings" component={Settings} />
            </Route>
        </Router>
    </MuiThemeProvider>
), document.getElementById("root"));
