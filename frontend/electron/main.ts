import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog } from 'electron'
import path from 'path'
import log from 'electron-log'

// Configure logging
log.transports.file.level = 'info'
log.transports.console.level = 'debug'
log.info('Application starting...')

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error)
  dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`)
  app.exit(1)
})

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled Rejection:', reason)
})

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  log.info('Creating main window...')
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: '#0D1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  })

  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show')
    mainWindow?.show()
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
      log.info('Window hidden to tray')
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  log.info('Main window created successfully')
}

function createTray() {
  log.info('Creating system tray...')
  
  // Create a simple 16x16 icon
  const iconPath = isDev 
    ? path.join(__dirname, '../src/assets/icon.png')
    : path.join(__dirname, '../dist/assets/icon.png')
  
  // Create a default icon if file doesn't exist
  let trayIcon: nativeImage
  try {
    trayIcon = nativeImage.createFromPath(iconPath)
    if (trayIcon.isEmpty()) {
      trayIcon = nativeImage.createEmpty()
    }
  } catch {
    trayIcon = nativeImage.createEmpty()
  }

  tray = new Tray(trayIcon.isEmpty() ? nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADNSURBVDiNpZMxDoJAEEXfLhZewMbKxoPYeQcbL2DnHewsrCy9gI2VhYWFMcTgBSysTCzMEP+ZySTbz2Qym92ZDKgU8AJ0gTPQAbaqekQqvQUuQMUD4JPAE3AF9kALmAGrqs6B3h/AuwCeVfUKtD6BPWc8q+odWAJLVX0C68DdB3B3wLuqPoFN4OQDOAC2qvqqqi9gFViGwD4EOsBIVZ/A0gduP/AABkC/BOgCO8A+BHYhkA+BXQjshMAuBHYhkA+BXQjshMAuBHYhkA+BXQj8AI7qH3m8x4z4AAAAAElFTkSuQmCC') : trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Jarvis',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      }
    },
    {
      label: 'Voice Command',
      click: () => {
        mainWindow?.webContents.send('activate-voice')
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Jarvis Local')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })

  log.info('System tray created')
}

// IPC Handlers for window controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
    return false
  } else {
    mainWindow?.maximize()
    return true
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.hide()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

// IPC Handlers for app info
ipcMain.handle('app:getPath', (_, name: string) => {
  return app.getPath(name as any)
})

ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})

// App lifecycle
app.whenReady().then(() => {
  log.info('App ready')
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  isQuitting = true
})

log.info('Main process initialized')
