import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/constants/ipc'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

type ConnectOracle = {
  user: string
  password: string
}
const api = {
  async connect(
    data: ConnectOracle,
  ): Promise<{ success: boolean; message: string }> {
    const response = await ipcRenderer.invoke(IPC.DATABASE.CONNECT, data)
    console.log('data', data, response)
    return await ipcRenderer.invoke(IPC.DATABASE.CONNECT, data)
  },
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
