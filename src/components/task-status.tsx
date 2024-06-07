export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

interface TaskStatusProps {
  status: TaskStatus
}

const taskStatusMap: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Executando',
  COMPLETED: 'Finalizada',
}

export function TaskStatus({ status }: TaskStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'PENDING' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-slate-400"
        />
      )}

      {status === 'COMPLETED' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-emerald-500"
        />
      )}

      {status === 'IN_PROGRESS' && (
        <span
          data-testid="badge"
          className="h-2 w-2 rounded-full bg-amber-500"
        />
      )}

      <span className="dark:font-medium dark:text-muted-foreground">
        {taskStatusMap[status]}
      </span>
    </div>
  )
}
