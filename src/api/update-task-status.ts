import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface updateTaskProps {
  id: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

export async function updateTaskStatus({ id, status }: updateTaskProps) {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  await api.patch(
    `/tasks/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}
