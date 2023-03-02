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
        width: 960,
        height: 540,
        show: false,
        kiosk: true,
        fullscreen: false,
        autoHideMenuBar: false,
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
        width: 1920,
        height: 1080,
        show: false,
        kiosk: true,
        fullscreen: false,
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50,
        autoHideMenuBar: false,
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
    MAIN.loadFile('html/people/detail/main/itel/itel.html').then(() => {
        MAIN.show();
    })
    TOUCH.loadFile('html/people/detail/touch/itel/itel_touch.html').then(() => {
        TOUCH.show();
    })
}


electronIpcMain.on('message:people', () => {
    showDetails();
})