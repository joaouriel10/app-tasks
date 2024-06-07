/* eslint-disable camelcase */
import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface GetTasksQuery {
  page?: number | null
  name: string | null
  id: string | null
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | null
}

export interface GetTasksResponse {
  data: {
    id: string
    name: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    user_id: string
    created_at: string
  }[]
  limit: number
  total: number
  totalPage: number
  page: number
}

export async function getTasks({
  page,
  name,
  status,
  id,
}: GetTasksQuery): Promise<GetTasksResponse> {
  const { 'Zhavia-tasks@token': token } = parseCookies()
  const params = {} as GetTasksQuery

  if (name) {
    params.name = name.replace(/^\s+|\s+$/g, '')
  }

  if (status) {
    params.status = status
  }

  if (id) {
    params.id = id.replace(/^\s+|\s+$/g, '')
  }

  const response = await api.get<GetTasksResponse>('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      ...params,
      page,
    },
  })

  return response.data
}
