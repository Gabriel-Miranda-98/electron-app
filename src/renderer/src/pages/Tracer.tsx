import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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
  const [eventId, setEventId] = useState<NodeJS.Timeout | null>(null)
  const location = useLocation()
  const { sid, serial } = location.state as LocationState

  useEffect(() => {
    window.api.onError((message) => {
      toast({
        title: 'Erro',
        description: message,
        className: 'bg-red-600 text-white',
      })
    })
    window.api.onStart()
    // return () => {
    //   if (eventId) {
    //     window.api.stopTracer({ eventId })
    //   }
    // }
  }, [])

  const { data, refetch } = useQuery<Command[]>({
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
      })
      refetch()
    }
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
          {data &&
            data.map((command, index) => (
              <div key={index}>{command.sql_text}</div>
            ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
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
