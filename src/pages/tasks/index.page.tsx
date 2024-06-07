import { Header } from '@/components/header'
import Tasks from './tasks'

export default function Task() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
        <Tasks />
      </div>
    </div>
  )
}
