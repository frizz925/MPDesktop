var electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({width: 1000, height: 800});
    mainWindow.loadURL("http://localhost:3000/");
    mainWindow.webContents.openDevTools();
    mainWindow.setMenu(null);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
