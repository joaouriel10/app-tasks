import { Header } from '@/components/header'
import Users from './users/users'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
        <Users />
      </div>
    </div>
  )
}
