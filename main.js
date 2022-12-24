const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const {screen} = require('electron')
const nodePath = require("path");
let MAIN;
let TOUCH;
let externalDisplay;

function createWindow() {
    return new electronBrowserWindow({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        show: false,
        kiosk: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: nodePath.join(__dirname, 'preload.js')
        }
    });
}

function createSecondWindow() {
    const {screen} = require('electron')
    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    return new electronBrowserWindow({
        width: 800,
        height: 600,
        show: false,
        kiosk: true,
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: nodePath.join(__dirname, 'preload.js')
        }
    });
}

function showMainWindow() {
    MAIN.loadFile('main.html').then(() => {
        MAIN.show();
    })
}

function showTouchWindow() {
    TOUCH.loadFile('touch.html').then(() => {
        TOUCH.show();
    })
}


electronApp.on('ready', () => {
    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })
    if(externalDisplay) {
        TOUCH = createSecondWindow();
        showTouchWindow();
    }

    MAIN = createWindow();
    showMainWindow();
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});

electronApp.on('activate', () => {
    if (electronBrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


function showDetails() {
    MAIN.loadFile('detail.html').then(() => {
        MAIN.show();
    })
}


electronIpcMain.on('message:detailsShow', () => {
    showDetails();
})