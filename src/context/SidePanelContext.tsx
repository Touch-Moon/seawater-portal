'use client'

import { createContext, useContext, useState } from 'react'

interface SidePanelContextValue {
  open: boolean
  openPanel: () => void
  closePanel: () => void
}

const SidePanelContext = createContext<SidePanelContextValue>({
  open: false,
  openPanel: () => {},
  closePanel: () => {},
})

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SidePanelContext.Provider
      value={{
        open,
        openPanel: () => setOpen(true),
        closePanel: () => setOpen(false),
      }}
    >
      {children}
    </SidePanelContext.Provider>
  )
}

export function useSidePanel() {
  return useContext(SidePanelContext)
}
