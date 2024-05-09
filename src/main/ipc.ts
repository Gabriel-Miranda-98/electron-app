import { ipcMain } from 'electron'
import Database from './database'

ipcMain.handle('login', async (event, data) => await logion(data))

async function logion(data: { user: string; password: string }) {
  try {
    const db = Database.getInstance()
    await db.connect(data.user, data.password)
    return { success: true, message: 'Conexão estabelecida com sucesso!' }
  } catch (error) {
    return { success: false, message: 'Falha ao conectar ao banco de dados.' }
  }
}
