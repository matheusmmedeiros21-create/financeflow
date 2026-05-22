const { app, BrowserWindow, Notification } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    autoHideMenuBar: true,
    backgroundColor: '#f4f4f5',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const isDev = !app.isPackaged

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  setInterval(() => {
    if (Notification.isSupported()) {
      new Notification({
        title: 'FinanceFlow',
        body: 'Você possui contas próximas do vencimento.'
      }).show()
    }
  }, 60000)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
