import { Loader2, MoreHorizontal, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Filter } from '../components/Filter'

export function Monitor() {
  const [search, setSearch] = useState('' as string)
  const [filter, setFilter] = useState('all' as string)
  const { data, isLoading } = useQuery({
    queryKey: ['sessions', { search, filter }],
    queryFn: async () => {
      const response = await window.api.getAllSessions({ search, filter })
      return response
    },
    initialData: [],
  })
  function handleStartTrace(sid: string, serial: string) {
    console.log('Monitorar sessão: ', sid, serial)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>
        <main className=" flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 ">
          <Card className="mt-2">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Sessões</CardTitle>
                <CardDescription>
                  Sessões existentes na base de dados
                </CardDescription>
              </div>
              <Filter filter={filter} setFilter={setFilter} />
            </CardHeader>
            <CardContent className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin  scrollbar-thumb-stone-800 scrollbar-track-stone-600 md:max-h-[400px] lg:max-h-[600px] overflow-y-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sid</TableHead>
                    <TableHead>Serial#</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Usuário
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      OsUser
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Programa
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    data.map((session) => (
                      <TableRow key={session.sid}>
                        <TableCell className="font-medium">
                          {session.sid}
                        </TableCell>
                        <TableCell>{session.serial}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {session.username}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="default">{session.osuser}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{session.program}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStartTrace(session.sid, session.serial)
                                }
                              >
                                Monitorar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
