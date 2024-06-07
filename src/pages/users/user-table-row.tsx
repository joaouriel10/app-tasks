import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { TableCell, TableRow } from '@/components/ui/table'

export interface UserTableRowProps {
  user: {
    id: string
    name: string
    email: string
    created_at: string
  }
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">{user.id}</TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(user.created_at, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  )
}
