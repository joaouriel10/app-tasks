import { z } from 'zod'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { getTasks } from '@/api/get-tasks'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TaskTableRow } from './task-table-row'
import { TaskTableFilters } from './task-table-filters'
import { TaskTableSkeleton } from './task-table-skeleton'

export default function Tasks() {
  const router = useRouter()
  const { query } = router

  const id = query.id as string | null
  const name = query.name as string | null
  const status = query.status as
    | 'ALL'
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | null

  const page = z.coerce
    .number()
    .transform((page) => page)
    .parse(query.page ?? '1')

  const { data: result, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', page, id, name, status],
    queryFn: () =>
      getTasks({
        page,
        id,
        name,
        status: status === 'ALL' ? null : status,
      }),
  })

  function handlePaginate(page: number) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: page.toString(),
      },
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold -tracking-tight">Tarefas</h1>

        <div className="space-y-2.5">
          <TaskTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Identificador</TableHead>
                  <TableHead className="w-[150px]">Nome</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[164px]">Alterar Status</TableHead>
                  <TableHead className="w-[170px]">Criado há</TableHead>
                  <TableHead className="w-[164px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTasks && <TaskTableSkeleton />}

                {result &&
                  result.data.map((task) => {
                    return <TaskTableRow key={task.id} task={task} />
                  })}
              </TableBody>
            </Table>
          </div>

          {result && (
            <Pagination
              onPageChange={handlePaginate}
              page={result.page}
              total={result.total}
              limit={result.limit}
            />
          )}
        </div>
      </div>
    </>
  )
}
