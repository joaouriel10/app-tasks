import '../styles/globals.css'
import { Toaster } from 'sonner'
import type { AppProps } from 'next/app'
import { queryClient } from '@/lib/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme/theme-provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider storageKey="tasks-theme" defaultTheme="dark">
      <AuthProvider>
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
