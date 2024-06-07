import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Search, X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { StoreTaskDialog } from '@/components/store-task-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const taskFiltersSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
})

type TaskFiltersSchema = z.infer<typeof taskFiltersSchema>

export function TaskTableFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { query } = router

  const id = query.id as string | undefined
  const name = query.customerName as string | undefined
  const status = query.status as string | undefined

  const { register, handleSubmit, control, reset } = useForm<TaskFiltersSchema>(
    {
      resolver: zodResolver(taskFiltersSchema),
      defaultValues: {
        id: id ?? '',
        name: name ?? '',
        status: status ?? 'ALL',
      },
    },
  )

  function handleFilter({ id, name, status }: TaskFiltersSchema) {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        id: id || undefined,
        name: name || undefined,
        status: status || undefined,
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
      status: 'ALL',
    })
  }

  return (
    <div className="flex flex-row justify-between">
      <form
        onSubmit={handleSubmit(handleFilter)}
        className="flex items-center gap-2"
      >
        <span className="text-sn font-semibold">Filtros</span>
        <Input
          placeholder="Id da tarefa"
          className="h-8 w-auto"
          {...register('id')}
        />
        <Input
          placeholder="Nome da tarefa"
          className="h-8 w-[320px]"
          {...register('name')}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => {
            return (
              <Select
                defaultValue="all"
                name={name}
                onValueChange={onChange}
                value={value}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos status</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Executando</SelectItem>
                  <SelectItem value="COMPLETED">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            )
          }}
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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
          >
            Criar tarefa
          </Button>
        </DialogTrigger>

        <StoreTaskDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </Dialog>
    </div>
  )
}
