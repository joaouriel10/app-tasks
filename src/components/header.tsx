import { LayoutList, Users, ClipboardList } from 'lucide-react'

import { NavLink } from './nav-link'
import { Separator } from './ui/separator'
import { AccountMenu } from './account-menu'
import { ThemeToggle } from './theme/theme-toggle'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <ClipboardList className="h-6 w-6"></ClipboardList>

        <Separator className="h-6" orientation="vertical" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/">
            <Users className="h-4 w-4" />
            Usuarios
          </NavLink>
          <NavLink href="/tasks">
            <LayoutList className="h-4 w-4" />
            Tarefas
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
