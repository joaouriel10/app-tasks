import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface updateTaskProps {
  name: string
  description: string
  userId: string
}

export async function createTask({
  name,
  description,
  userId,
}: updateTaskProps) {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  const data = {
    name,
    status: 'PENDING',
    description,
    user_id: userId,
  }

  await api.post('/tasks', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
