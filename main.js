"use strict";
var electron = require('electron');
var lodash = require('lodash');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({width: 1000, height: 800, useContentSize: true});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.setMenu(null);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
