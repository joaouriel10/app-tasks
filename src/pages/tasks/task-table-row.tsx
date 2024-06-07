import { useState } from 'react'
import { ptBR } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Search, Pencil } from 'lucide-react'

import { TaskDetails } from './task-details'
import { queryClient } from '@/lib/react-query'
import { Button } from '@/components/ui/button'
import { GetTasksResponse } from '@/api/get-tasks'
import { TaskStatus } from '@/components/task-status'
import { updateTaskStatus } from '@/api/update-task-status'
import { TableCell, TableRow } from '@/components/ui/table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { UpdateTaskDialog } from '@/components/update-task-dialog'

export interface TaskTableRowProps {
  task: {
    id: string
    name: string
    description: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    created_at: string
    user_id: string
  }
}

export function TaskTableRow({ task }: TaskTableRowProps) {
  const [isOpenDetails, setIsOpenDetails] = useState(false)
  const [isOpenEdit, setIsOpenEdit] = useState(false)

  function updateTaskStatusOnCahce(id: string, status: TaskStatus) {
    const tasksListCache = queryClient.getQueriesData<GetTasksResponse>({
      queryKey: ['tasks'],
    })

    tasksListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return
      }

      queryClient.setQueryData<GetTasksResponse>(cacheKey, {
        ...cacheData,
        data: cacheData.data.map((task) => {
          if (task.id === id) {
            return { ...task, status }
          } else {
            return task
          }
        }),
      })
    })
  }

  const { mutateAsync: updateTaskStatusFn, isPending: isUpdatingTask } =
    useMutation({
      mutationFn: updateTaskStatus,
      async onSuccess(_, { id, status }) {
        updateTaskStatusOnCahce(id, status)
      },
    })

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">{task.id}</TableCell>
      <TableCell className="font-medium">{task.name}</TableCell>
      <TableCell>
        <TaskStatus status={task.status} />
      </TableCell>
      <TableCell>
        {task.status === 'PENDING' && (
          <Button
            onClick={() =>
              updateTaskStatusFn({ id: task.id, status: 'IN_PROGRESS' })
            }
            disabled={isUpdatingTask}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Executando
          </Button>
        )}

        {task.status === 'IN_PROGRESS' && (
          <Button
            onClick={() =>
              updateTaskStatusFn({ id: task.id, status: 'COMPLETED' })
            }
            disabled={isUpdatingTask}
            variant="outline"
            size="xs"
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Finalizada
          </Button>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(task.created_at, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <Dialog open={isOpenDetails} onOpenChange={setIsOpenDetails}>
          <DialogTrigger asChild>
            <Button className="mr-2" variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da tarefa</span>
            </Button>
          </DialogTrigger>

          <TaskDetails
            open={isOpenDetails}
            id={task.id}
            userId={task.user_id}
          />
        </Dialog>
        <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Editar tarefa</span>
            </Button>
          </DialogTrigger>

          <UpdateTaskDialog
            isOpen={isOpenEdit}
            setIsOpen={setIsOpenEdit}
            task={{
              id: task.id,
              name: task.name,
              description: task.description,
              userId: task.user_id,
            }}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
