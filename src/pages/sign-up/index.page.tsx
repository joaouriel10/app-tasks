import { z } from 'zod'
import Link from 'next/link'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { LayoutList } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const signUpFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type SignUpFormDataSchema = z.infer<typeof signUpFormSchema>

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormDataSchema>({
    resolver: zodResolver(signUpFormSchema),
  })

  const router = useRouter()

  async function handleSignUp({ name, email, password }: SignUpFormDataSchema) {
    try {
      await api.post('/users', { name, email, password })

      await router.push('/sign-in')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
      }
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <LayoutList className="h-5 w-5" />
          <span className="font-semibold">Tasks</span>
        </div>
        <footer className="text-sm">
          &copy; Tasks - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <div>
          <div className="p-8">
            <Button variant="ghost" asChild className="absolute right-8 top-8">
              <Link href="/sign-in">Fazer login</Link>
            </Button>
            <div className="w-(350px) flex flex-col justify-center gap-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Criar conta grátis
                </h1>
                <p className="text-sm text-foreground">
                  Seja um parceiro e começe a visualizar as tarefas
                </p>
              </div>

              <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input id="name" type="text" {...register('name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Seu e-mail</Label>
                  <Input id="email" type="email" {...register('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Sua senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                  />
                </div>

                <Button
                  disabled={isSubmitting}
                  className="w-full"
                  type="submit"
                >
                  Finalizar cadastro
                </Button>

                <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                  Ao continuar você concorda com nossos{' '}
                  <a className="underline underline-offset-4" href="">
                    Termos de serviço
                  </a>{' '}
                  e{' '}
                  <a className="underline underline-offset-4" href="">
                    politicas de privacidade
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
