'use client'

import { api } from '@/lib/axios'
import { queryClient } from '@/lib/react-query'
import { useRouter } from 'next/router'
import { setCookie, destroyCookie } from 'nookies'
import { ReactNode, createContext } from 'react'

type SignInData = {
  email: string
  password: string
}

type Response = {
  data: {
    token: string
  }
}

type AuthContextType = {
  signIn: (data: SignInData) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()

  async function signIn({ email, password }: SignInData) {
    const {
      data: { token },
    }: Response = await api.post('/authorize', {
      email,
      password,
    })

    setCookie(undefined, 'Zhavia-tasks@token', token, { maxAge: 60 * 60 * 24 })
  }

  async function signOut() {
    destroyCookie(undefined, 'Zhavia-tasks@token')
    await router.push('/sign-in')
    queryClient.removeQueries()
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
