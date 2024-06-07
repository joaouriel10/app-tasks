import { ptBR } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import { useQuery } from '@tanstack/react-query'

import { TaskStatus } from '@/components/task-status'
import { getTaskDetails } from '@/api/get-task-details'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { getUser } from '@/api/get-user'

export interface TaskDetailsProps {
  id: string
  userId: string
  open: boolean
}

export function TaskDetails({ id, userId, open }: TaskDetailsProps) {
  const { data: task } = useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskDetails({ id }),
    enabled: open,
  })

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser({ id: userId }),
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes da tarefa</DialogTitle>
        <DialogDescription>{task?.task.id}</DialogDescription>
      </DialogHeader>
      {task && user ? (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Status</TableCell>
                <TableCell className="flex justify-end">
                  <TaskStatus status={task?.task.status ?? 'PENDING'} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Nome</TableCell>
                <TableCell className="flex justify-end">
                  {task?.task.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Descrição
                </TableCell>
                <TableCell className="flex justify-end">
                  {task?.task.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Usuário</TableCell>
                <TableCell className="flex justify-end">
                  {user?.user.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Realizado há
                </TableCell>
                <TableCell className="flex justify-end">
                  {formatDistanceToNow(task?.task.created_at, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <></>
      )}
    </DialogContent>
  )
}
