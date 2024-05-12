import { createFileRoute, createURLRoute } from 'electron-router-dom'

import { app, shell, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import './ipc'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import icon from '../../resources/icon.png?asset'
import Database from './database'
import oracledb from 'oracledb'
oracledb.fetchAsString = [oracledb.CLOB]
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.initOracleClient()

function createWindow(width = 900, height = 700) {
  const mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    center: true,
    minHeight: 700,
    minWidth: 900,
    resizable: true,
    transparent: true,
    title: 'Oracle Monitor',
    backgroundColor: '#fff',
    ...(process.platform === 'linux'
      ? {
          icon,
        }
      : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })
  mainWindow.setMenuBarVisibility(true)
  mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show', () => {
    try {
      mainWindow.show()
    } catch (error) {
      console.log(error)
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devServerURL = createURLRoute(
    process.env.ELECTRON_RENDERER_URL!,
    'main',
  )

  const fileRoute = createFileRoute(
    path.join(__dirname, '../renderer/index.html'),
    'main',
  )
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }

  return mainWindow
}

if (process.platform === 'darwin') {
  app.dock.setIcon(path.resolve(__dirname, 'icon'))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  createWindow(width, height)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', async () => {
  const db = Database.getInstance()
  await db.disconnect()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
