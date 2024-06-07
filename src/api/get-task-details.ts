/* eslint-disable camelcase */
import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface GetTasksProps {
  id: string
}

export interface GetTaskResponse {
  task: {
    id: string
    name: string
    description: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    user_id: string
    created_at: string
  }
}

export async function getTaskDetails({
  id,
}: GetTasksProps): Promise<GetTaskResponse> {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  const response = await api.get<GetTaskResponse>(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}
