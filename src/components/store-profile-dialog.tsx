import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { GetProfileResponse, getProfile } from '@/api/get-profile'
import { updateProfile } from '@/api/update-profile'

const storeProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  function updateProfileCache({ name, email }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<GetProfileResponse>(['profile'])

    if (cached) {
      queryClient.setQueryData<GetProfileResponse>(['profile'], {
        ...cached,
        name,
        email,
      })
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, email }) {
      const { cached } = updateProfileCache({ name, email })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateProfileCache(context.previousProfile)
      }
    },
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const { register, handleSubmit } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
    },
  })

  async function handleUpdateProfile({ name, email }: StoreProfileSchema) {
    try {
      await updateProfileFn({
        id: profile?.id || '',
        name,
        email,
      })

      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar o perfil, tente novamente')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil do usuário</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu usuário
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
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
            <Label className="text-right" htmlFor="email">
              E-mail
            </Label>
            <Input className="col-span-3" id="email" {...register('email')} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
