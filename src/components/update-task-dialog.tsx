import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { getUsers } from '@/api/get-users'
import { updateTask } from '@/api/update-task'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const storeTaskSchema = z.object({
  name: z.string().min(1),
  userId: z.string().min(1),
  description: z.string().min(1),
})

type StoreTaskSchema = z.infer<typeof storeTaskSchema>

type StoreTaskDialogProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  task: {
    id: string
    name: string
    description: string
    userId: string
  }
}

export function UpdateTaskDialog({
  isOpen,
  setIsOpen,
  task,
}: StoreTaskDialogProps) {
  const router = useRouter()
  const { mutateAsync: updateTaskFn } = useMutation({
    mutationFn: updateTask,
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      getUsers({
        limit: 999,
        name: '',
        email: '',
      }),
  })

  const { register, handleSubmit, control } = useForm<StoreTaskSchema>({
    resolver: zodResolver(storeTaskSchema),
    values: {
      name: task.name,
      description: task.description,
      userId: task.userId,
    },
  })

  async function handleCreateTask({
    name,
    userId,
    description,
  }: StoreTaskSchema) {
    if (userId === 'all') {
      toast.error('Selecione um usuário valido')
      return
    }

    try {
      const data = { name, user_id: userId, description }
      await updateTaskFn({
        id: task.id,
        data,
      })
      setIsOpen(false)
      router.push({
        pathname: router.pathname,
      })
      toast.success('Tarefa criada com sucesso!')
    } catch (e) {
      console.log(e)
      toast.error('Erro ao criar tarefa, tente novamente')
    }
  }

  return (
    <Dialog
      defaultOpen={false}
      open={isOpen}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar uma nova tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateTask)}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="name">
                Nome
              </Label>
              <Input className="col-span-3" id="name" {...register('name')} />
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="description">
                Descrição
              </Label>
              <Textarea
                className="col-span-3"
                id="description"
                {...register('description')}
              />
            </div>
          </div>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="email">
                Usuário
              </Label>
              <Controller
                name="userId"
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
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Selecione um usuário
                        </SelectItem>
                        {users?.data.map((user) => {
                          return (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  )
                }}
              />
            </div>
          </div>

          <DialogFooter className="mt-3.5">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" variant="success">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
