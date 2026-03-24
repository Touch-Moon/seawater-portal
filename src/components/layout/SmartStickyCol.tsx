'use client'

import { useSmartSticky } from '@/hooks/useSmartSticky'

interface Props {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'aside'
}

export default function SmartStickyCol({ children, className, as = 'aside' }: Props) {
  const ref = useSmartSticky<HTMLDivElement>()

  if (as === 'div') {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }
  return (
    <aside ref={ref} className={className}>
      {children}
    </aside>
  )
}
