import { z } from 'zod'
import Link from 'next/link'
import { useContext } from 'react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { LayoutList } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormDataSchema = z.infer<typeof signInFormSchema>

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormDataSchema>({
    resolver: zodResolver(signInFormSchema),
  })

  const router = useRouter()

  async function handleSignIn({ email, password }: SignInFormDataSchema) {
    try {
      await signIn({ email, password })

      await router.push('/')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        toast.error('E-mail ou senha não conferem, tente novamente')
        return
      }
      toast.error('Erro ao fazer login, tente novamente')
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
          <div className="p-8 w-80">
            <Button variant="ghost" asChild className="absolute right-8 top-8">
              <Link href="/sign-up" className="">
                Novo usuario!
              </Link>
            </Button>
            <div className="w-(350px) flex flex-col justify-center items-center gap-3">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Acessar painel
                </h1>
                <p className="text-sm text-foreground">
                  Sistemas feito para acompanhar as tarefas!
                </p>
              </div>

              <form
                onSubmit={handleSubmit(handleSignIn)}
                className="space-y-2 w-96"
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Seu e-mail</Label>
                  <Input id="email" type="email" {...register('email')} />
                </div>
                <div className="space-y-1">
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
                  Acessar painel
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
