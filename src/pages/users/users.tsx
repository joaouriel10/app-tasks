import { z } from 'zod'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { getUsers } from '@/api/get-users'
import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { UserTableRow } from './user-table-row'
import { UserTableFilters } from './user-table-filters'
import { UserTableSkeleton } from './user-table-skeleton'

export default function Users() {
  const router = useRouter()
  const { query } = router

  const email = query.email as string | null
  const name = query.name as string | null

  const page = z.coerce
    .number()
    .transform((page) => page)
    .parse(query.page ?? '1')

  const { data: result, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', page, email, name],
    queryFn: () =>
      getUsers({
        page,
        email,
        name,
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
        <h1 className="text-3xl font-bold -tracking-tight">Usuários</h1>

        <div className="space-y-2.5">
          <UserTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[450px]">Identificador</TableHead>
                  <TableHead className="w-[150px]">Nome</TableHead>
                  <TableHead className="w-[150px]">E-mail</TableHead>
                  <TableHead className="w-[170px]">Criado há</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers && <UserTableSkeleton />}

                {result &&
                  result.data.map((user) => {
                    return <UserTableRow key={user.id} user={user} />
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
