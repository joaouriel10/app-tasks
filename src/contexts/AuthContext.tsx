'use client'

import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { setCookie, destroyCookie, parseCookies } from 'nookies'
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

  function signOut() {
    destroyCookie(undefined, 'Zhavia-tasks@token')
    router.push('/sign-in')
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
