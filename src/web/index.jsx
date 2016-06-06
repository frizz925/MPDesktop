import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import 'normalize-css';

import App from './App.jsx';

import * as backend from './backend';
import * as player from './player';
import routes from './routes';
import { incrementSeeker, incrementUptime, updateStats } from 'actions';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.blueGrey500,
        primary2Color: Colors.blueGrey700
    }
});

backend.init();

render((
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={backend.store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    {_.map(routes, (route, idx) => (
                        idx == 0 
                            ? <IndexRoute key={idx} component={route.component} />
                            : <Route key={idx} path={route.path} component={route.component} />
                    ))}
                </Route>
            </Router>
        </Provider>
    </MuiThemeProvider>
), document.getElementById("root"));

setInterval(() => {
    var state = backend.store.getState();
    if (state.status.state == "play") {
        var stats = state.stats;
        backend.store.dispatch(updateStats(
            _.assign(stats, {
                uptime: ++stats.uptime,
                playtime: ++stats.playtime
            })
        ));
        backend.store.dispatch(incrementSeeker());
    } else {
        backend.store.dispatch(incrementUptime());
    }
}, 1000);

