import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/constants/ipc'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { Command } from '../renderer/src/pages/Tracer'
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
    return await ipcRenderer.invoke(IPC.DATABASE.CONNECT, data)
  },

  async disconnect(): Promise<{ success: boolean; message: string }> {
    return await ipcRenderer.invoke(IPC.DATABASE.DISCONNECT)
  },

  async getAllSessions({
    search,
    filter,
  }: {
    search: string
    filter: string
  }): Promise<
    Array<{
      sid: string
      serial: string
      username: string
      osuser: string
      program: string
    }>
  > {
    return await ipcRenderer.invoke(IPC.MONITOR.GET_ALL_SESSIONS, {
      search,
      filter,
    })
  },

  async getCommands({
    sid,
    serial,
  }: {
    sid: string
    serial: string
  }): Promise<void> {
    return await ipcRenderer.invoke(IPC.MONITOR.GET_COMMANDS, { sid, serial })
  },

  onCommandUpdate(callback: (data: Command[]) => void): void {
    ipcRenderer.on(IPC.MONITOR.UPDATED, (event, data) => {
      callback(data)
    })
  },

  async onStart() {
    ipcRenderer.on(IPC.MONITOR.STARTED, (event, data) => {
      console.log('Tracer started:', data)
    })
  },

  onError(callback: (message: string) => void): void {
    ipcRenderer.on(IPC.MONITOR.ERROR, (event, data) => {
      callback(data)
    })
  },

  async stopTracer({
    eventId,
  }: {
    eventId: NodeJS.Timeout
  }): Promise<{ success: boolean; message: string }> {
    return await ipcRenderer.invoke(IPC.MONITOR.STOP_TRACER, eventId)
  },
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} else {
  console.error('Context Isolation is disabled!')
}
