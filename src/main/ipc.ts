import { ipcMain, IpcMainInvokeEvent } from 'electron'
import Database from './database'
import { IPC } from '../shared/constants/ipc'
import OracleDB, { BindParameter } from 'oracledb'
const intervalMap = new Map()

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
    let baseQuery = `SELECT sid "sid", serial# as "serial", username "username", osuser "osuser", program "program" FROM v$session  WHERE TYPE = 'USER'`

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

interface Command {
  sql_id: string
  sql_text: string
}

interface CommandArgs {
  sid: string
  serial: string
}

ipcMain.handle(
  IPC.MONITOR.GET_COMMANDS,
  async (event: IpcMainInvokeEvent, { sid, serial }: CommandArgs) => {
    const intervalId = setInterval(async () => {
      const db = Database.getInstance()
      const baseQuery = `SELECT sql_id "sql_id", sql_text "sql_text" FROM v$sql WHERE sql_id IN (SELECT sql_id FROM v$session WHERE sid = :sid AND serial# = :serial)`

      const bind = {
        sid: {
          dir: OracleDB.BIND_IN,
          val: parseInt(sid),
          type: OracleDB.NUMBER,
        },
        serial: {
          dir: OracleDB.BIND_IN,
          val: parseInt(serial),
          type: OracleDB.NUMBER,
        },
      }

      try {
        const result = await db.executeQuery<Command[]>(baseQuery, bind)

        event.sender.send(IPC.MONITOR.UPDATED, {
          sid,
          serial,
          commands: result,
        })
      } catch (error) {
        console.error('Error during database polling:', error)
        event.sender.send(
          IPC.MONITOR.ERROR,
          `Erro ao executar rastreamento: ${error}`,
        )
      }
    }, 500)
    const key = `${sid}-${serial}-${Date.now()}`
    intervalMap.set(key, intervalId)

    event.sender.send(IPC.MONITOR.STARTED, {
      message: 'Tracer iniciado com sucesso!',
      eventId: key,
    })
  },
)

ipcMain.handle(IPC.MONITOR.STOP_TRACER, (event, key) => {
  if (intervalMap.has(key)) {
    clearInterval(intervalMap.get(key))
    intervalMap.delete(key)

    return { success: true, message: 'Tracer Cancelado!' }
  }
})
