import { api } from '@/lib/axios'
import { parseCookies } from 'nookies'

export interface UpdateProfileResponse {
  id: string
  name: string
  email: string
}

export async function updateProfile({
  id,
  name,
  email,
}: UpdateProfileResponse): Promise<void> {
  const { 'Zhavia-tasks@token': token } = parseCookies()
  await api.patch(
    `/users/${id}`,
    {
      name,
      email,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
}
