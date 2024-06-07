/* eslint-disable camelcase */
import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface GetUsersProps {
  id: string
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    email: string
    created_at: string
  }
}

export async function getUser({ id }: GetUsersProps): Promise<GetUserResponse> {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  const response = await api.get<GetUserResponse>(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}
