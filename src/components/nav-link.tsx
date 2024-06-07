import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

export type NavLinkProps = LinkProps & {
  children: React.ReactNode
}

export function NavLink(props: NavLinkProps) {
  const { pathname } = useRouter()

  return (
    <Link href={props.href} passHref legacyBehavior>
      <a
        data-current={pathname === props.href}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
        {...props}
      >
        {props.children}
      </a>
    </Link>
  )
}
