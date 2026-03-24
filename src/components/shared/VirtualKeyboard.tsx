'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ── Key layout ──────────────────────────────
const ROWS_NORMAL = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['⇧','z','x','c','v','b','n','m',',','.','/',],
]
const ROWS_SHIFT = [
  ['~','!','@','#','$','%','^','&','*','(',')','_','+','⌫'],
  ['Q','W','E','R','T','Y','U','I','O','P','{','}','|'],
  ['A','S','D','F','G','H','J','K','L',':','"'],
  ['⇧','Z','X','C','V','B','N','M','<','>','?'],
]

interface VirtualKeyboardProps {
  onInput:     (char: string) => void
  onBackspace: () => void
  onSubmit:    () => void
  onClose:     () => void
}

export default function VirtualKeyboard({
  onInput,
  onBackspace,
  onSubmit,
  onClose,
}: VirtualKeyboardProps) {
  const [isShift, setIsShift]   = useState(false)
  const [pos, setPos]           = useState<{ x: number; y: number } | null>(null)
  const dragging                = useRef(false)
  const dragStart               = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

  // Set initial position bottom-right after mount (avoids SSR mismatch)
  useEffect(() => {
    setPos({
      x: Math.max(0, window.innerWidth  - 540),
      y: Math.max(0, window.innerHeight - 320),
    })
  }, [])

  // ── Drag handlers ──
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (!pos) return
    dragging.current = true
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX:   pos.x,
      posY:   pos.y,
    }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - dragStart.current.mouseX
      const dy = e.clientY - dragStart.current.mouseY
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 520, dragStart.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 280, dragStart.current.posY + dy)),
      })
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  // ── Key press ──
  const handleKey = (key: string) => {
    if (key === '⌫') {
      onBackspace()
      return
    }
    if (key === '⇧') {
      setIsShift((v) => !v)
      return
    }
    onInput(key)
    if (isShift) setIsShift(false) // one-shot shift
  }

  const rows = isShift ? ROWS_SHIFT : ROWS_NORMAL

  // Not mounted yet
  if (!pos) return null

  // Portal to document.body — prevents parent stacking context from blocking backdrop-filter
  return createPortal(
    <div
      className="virtual-keyboard"
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-label="Virtual keyboard"
    >
      {/* Drag handle / title bar */}
      <div
        className="virtual-keyboard__handle"
        onMouseDown={onDragStart}
        aria-label="Drag keyboard"
      >
        <span className="virtual-keyboard__handle-label">Keyboard</span>
        <button
          className="virtual-keyboard__close"
          onClick={onClose}
          aria-label="Close keyboard"
          type="button"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Key rows */}
      <div className="virtual-keyboard__rows">
        {rows.map((row, ri) => (
          <div key={ri} className="virtual-keyboard__row">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                className={[
                  'virtual-keyboard__key',
                  key === '⌫'  ? 'virtual-keyboard__key--wide'  : '',
                  key === '⇧'  ? `virtual-keyboard__key--shift${isShift ? ' virtual-keyboard__key--shift-active' : ''}` : '',
                ].join(' ').trim()}
                onClick={() => handleKey(key)}
                aria-label={key === '⌫' ? 'Backspace' : key === '⇧' ? 'Shift' : key}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row: Space + Search */}
        <div className="virtual-keyboard__row virtual-keyboard__row--bottom">
          <button
            type="button"
            className="virtual-keyboard__key virtual-keyboard__key--space"
            onClick={() => onInput(' ')}
            aria-label="Space"
          >
            Space
          </button>
          <button
            type="button"
            className="virtual-keyboard__key virtual-keyboard__key--search"
            onClick={onSubmit}
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
