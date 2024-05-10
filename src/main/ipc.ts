import { ipcMain } from 'electron'
import Database from './database'
import { IPC } from '../shared/constants/ipc'

ipcMain.handle(
  IPC.DATABASE.CONNECT,
  async (
    event,
    data: { user: string; password: string },
  ): Promise<{
    success: boolean
    message: string
  }> => {
    try {
      const db = Database.getInstance()
      await db.connect(data.user, data.password)
      return { success: true, message: 'Conexão estabelecida com sucesso!' }
    } catch (error) {
      return { success: false, message: 'Falha ao conectar ao banco de dados.' }
    }
  },
)

// async function logion(data: { user: string; password: string }): Promise<{
//   success: boolean
//   message: string
// }> {
//   try {
//     const db = Database.getInstance()
//     await db.connect(data.user, data.password)
//     return { success: true, message: 'Conexão estabelecida com sucesso!' }
//   } catch (error) {
//     return { success: false, message: 'Falha ao conectar ao banco de dados.' }
//   }
// }
