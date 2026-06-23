import React from 'react'

export type PageWrapperProps = React.HTMLAttributes<HTMLDivElement>

export function PageWrapper({ children, className = '', ...props }: PageWrapperProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  )
}
