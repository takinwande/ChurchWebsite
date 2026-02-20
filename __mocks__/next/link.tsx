import React from 'react'

const NextLink = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children?: React.ReactNode
}) => (
  <a href={href} {...props}>
    {children}
  </a>
)

NextLink.displayName = 'NextLink'
export default NextLink
