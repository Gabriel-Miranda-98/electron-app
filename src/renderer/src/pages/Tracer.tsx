import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '../components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area'
import { Button } from '../components/ui/button'

export interface Command {
  sql_id: string
  sql_text: string
}

interface LocationState {
  sid: string
  serial: string
}

export function Tracer() {
  const queryClient = useQueryClient()
  const [eventId, setEventId] = useState<string | null>(null)
  const location = useLocation()
  const navigation = useNavigate()
  const { sid, serial } = location.state as LocationState

  useEffect(() => {
    const handleCommandsUpdate = ({
      commands,
    }: {
      sid: string
      serial: string
      commands: Command[]
    }) => {
      queryClient.setQueryData<Command[]>(
        ['commands', { sid, serial }],
        (oldCommands) => {
          const updatedCommands = oldCommands ? [...oldCommands] : []

          commands.forEach((command) => {
            if (!updatedCommands.some((c) => c.sql_id === command.sql_id)) {
              updatedCommands.push(command)
            }
          })
          return updatedCommands
        },
      )
    }

    const handleStart = (data: { eventId: string; message: string }) => {
      setEventId(data.eventId)
      toast({
        title: 'Tracer Iniciado',
        description: data.message,
        className: 'bg-green-600 text-white',
      })
    }

    const handleError = (error: string) => {
      toast({
        title: 'Erro',
        description: error,
        className: 'bg-red-600 text-white',
      })
    }

    window.api.onError(handleError)
    window.api.onStart(handleStart)
    window.api.onCommandUpdate(handleCommandsUpdate)
    return () => {
      window.api.removeListeners()
    }
  }, [queryClient, sid, serial])

  const { data } = useQuery<Command[]>({
    queryKey: ['commands', { sid, serial }],
    queryFn: async () => {
      await window.api.getCommands({ sid, serial })

      return []
    },
    initialData: [],
    refetchOnWindowFocus: false,
  })

  const handleStopTrace = async () => {
    if (eventId) {
      const response = await window.api.stopTracer({ eventId })
      setEventId(null)
      toast({
        title: 'Tracer Parado',
        description: response.message,
        className: 'bg-red-600 text-white',
        duration: 5000,
      })
    }
  }

  function handleNavigationBack() {
    handleStopTrace()
    navigation('/monitor')
  }
  return (
    <Card className="w-full rounded-none h-screen">
      <CardHeader>
        <CardTitle className="text-2xl">Comandos Da Sessão</CardTitle>
        <CardDescription>
          Todos os comandos executados nesta sessão do banco de dados.
        </CardDescription>
        <Badge>
          Dados da sessão: SID: {sid} - SERIAL: {serial}
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full rounded-md border p-4 shadow-current md:h-96 lg:h-[700px]">
          <ScrollBar orientation="vertical" />
          <div className="divide-y">
            {data.map((command) => {
              return (
                <p key={command.sql_id} className="text-sm mt-2 py-2">
                  {command.sql_text}
                </p>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="default" onClick={handleNavigationBack}>
          voltar
        </Button>
        <Button
          variant="destructive"
          onClick={handleStopTrace}
          disabled={!eventId}
        >
          Parar Tracer
        </Button>
      </CardFooter>
    </Card>
  )
}
