import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export type NavLinkProps = LinkProps & {
  children: React.ReactNode
  className?: string
}

export function NavLink({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  className,
}: NavLinkProps) {
  const { pathname } = useRouter()

  return (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
      locale={locale}
      legacyBehavior
    >
      <a
        data-current={pathname === href}
        className={`flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground data-[current=true]:text-foreground ${className}`}
      >
        {children}
      </a>
    </Link>
  )
}
