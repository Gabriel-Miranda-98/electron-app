import { ipcMain } from 'electron'
import Database from './database'
import { IPC } from '../shared/constants/ipc'
import OracleDB, { BindParameter } from 'oracledb'

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

ipcMain.handle(
  IPC.DATABASE.DISCONNECT,
  async (): Promise<{ success: boolean; message: string }> => {
    try {
      const db = Database.getInstance()
      await db.disconnect()
      return { success: true, message: 'Conexão encerrada com sucesso!' }
    } catch (error) {
      return {
        success: false,
        message: 'Falha ao desconectar do banco de dados.',
      }
    }
  },
)

interface GetAllSessionsData {
  sid: string
  serial: string
  username: string
  osuser: string
  program: string
}

ipcMain.handle(
  IPC.MONITOR.GET_ALL_SESSIONS,
  async (
    event,
    { search, filter }: { search: string; filter: string },
  ): Promise<GetAllSessionsData[]> => {
    const bind: { [key: string]: BindParameter } = {}
    const db = Database.getInstance()
    let baseQuery = `SELECT sid "sid", serial# as "serial", username "username", osuser "osuser", program "program" FROM v$session WHERE username IS NOT NULL`

    if (search) {
      const searchQuery = ` AND (sid LIKE '%' || :search || '%' OR serial# LIKE '%' || :search || '%' OR username LIKE '%' || :search || '%' OR osuser LIKE '%' || :search || '%' OR program LIKE '%' || :search || '%')`
      baseQuery += searchQuery

      bind.search = {
        dir: OracleDB.BIND_IN,
        val: search,
        type: OracleDB.STRING,
      }
    }

    if (filter !== 'all') {
      const filterQuery = ` AND program = :filter`
      baseQuery += filterQuery
      bind.filter = {
        dir: OracleDB.BIND_IN,
        val: filter,
        type: OracleDB.STRING,
      }
    }

    const result = await db.executeQuery<GetAllSessionsData>(baseQuery, bind)
    return result
  },
)
