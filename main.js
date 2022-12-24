const { app, BrowserWindow } = require('electron')
let win
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        kiosk: true,
        autoHideMenuBar: true
    })
    win.loadFile('main.html')

}

app.whenReady().then(() => {
    const { screen } = require('electron')
    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    if (externalDisplay) {
        win2 = new BrowserWindow({
            x: externalDisplay.bounds.x + 50,
            y: externalDisplay.bounds.y + 50,
            width: 800,
            height: 600,
            kiosk: true,
            autoHideMenuBar: true
        })
        win2.loadFile('Touch.html')
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})