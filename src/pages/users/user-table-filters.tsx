import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const userFiltersSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
})

type UserFiltersSchema = z.infer<typeof userFiltersSchema>

export function UserTableFilters() {
  const router = useRouter()
  const { query } = router

  const id = query.id as string | undefined
  const name = query.customerName as string | undefined
  const email = query.email as string | undefined

  const { register, handleSubmit, reset } = useForm<UserFiltersSchema>({
    resolver: zodResolver(userFiltersSchema),
    defaultValues: {
      id: id ?? '',
      name: name ?? '',
      email: email ?? '',
    },
  })

  function handleFilter({ id, name, email }: UserFiltersSchema) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        id: id || undefined,
        name: name || undefined,
        email: email || undefined,
        page: '1',
      },
    })
  }

  function handleClearFilters() {
    router.push({
      pathname: router.pathname,
      query: { page: '1' },
    })

    reset({
      id: '',
      name: '',
      email: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sn font-semibold">Filtros</span>
      <Input
        placeholder="Id do usuário"
        className="h-8 w-auto"
        {...register('id')}
      />
      <Input
        placeholder="Nome do usuário"
        className="h-8 w-[320px]"
        {...register('name')}
      />
      <Input
        placeholder="E-mail do usuário"
        className="h-8 w-[320px]"
        {...register('email')}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultado
      </Button>

      <Button
        onClick={handleClearFilters}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}
