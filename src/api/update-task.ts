import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface updateTaskProps {
  id: string
  data: {
    name: string
    description: string
    user_id: string
  }
}

export async function updateTask({ id, data }: updateTaskProps) {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  await api.patch(
    `/tasks/${id}`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}
