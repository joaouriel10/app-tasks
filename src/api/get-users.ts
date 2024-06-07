/* eslint-disable camelcase */
import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface GetUsersQuery {
  page?: number | null
  limit?: number | null
  name: string | null
  email: string | null
}

export interface GetUsersResponse {
  data: {
    id: string
    name: string
    email: string
    created_at: string
  }[]
  limit: number
  total: number
  totalPage: number
  page: number
}

export async function getUsers({
  page,
  name,
  email,
}: GetUsersQuery): Promise<GetUsersResponse> {
  const { 'Zhavia-tasks@token': token } = parseCookies()
  const params = {} as GetUsersQuery

  if (name) {
    params.name = name.replace(/^\s+|\s+$/g, '')
  }

  if (email) {
    params.email = email.replace(/^\s+|\s+$/g, '')
  }

  const response = await api.get<GetUsersResponse>('/users', {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      ...params,
      page,
    },
  })

  return response.data
}
