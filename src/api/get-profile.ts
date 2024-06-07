import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface GetProfileResponse {
  id: string
  name: string
  email: string
}

export async function getProfile(): Promise<GetProfileResponse> {
  const { 'Zhavia-tasks@token': token } = parseCookies()

  const response = await api.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const user: GetProfileResponse = response.data?.user

  return user
}
