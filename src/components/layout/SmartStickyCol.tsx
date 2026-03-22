'use client'

import { useSmartSticky } from '@/hooks/useSmartSticky'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function SmartStickyCol({ children, className }: Props) {
  const ref = useSmartSticky<HTMLElement>()
  return (
    <aside ref={ref} className={className}>
      {children}
    </aside>
  )
}
