'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useSidePanel } from '@/context/SidePanelContext'

// Future: wire these to a global context
type TextSize = 'default' | 'large' | 'larger'
type AppearanceMode = 'light' | 'dark' | 'system'

export default function SettingsButton() {
  const [isOpen, setIsOpen]       = useState(false)
  const [textSize, setTextSize]   = useState<TextSize>(() => {
    if (typeof window === 'undefined') return 'default'
    return (localStorage.getItem('text-size') as TextSize) ?? 'default'
  })
  const panelRef                  = useRef<HTMLDivElement>(null)
  const btnRef                    = useRef<HTMLButtonElement>(null)
  const { theme, setTheme }       = useTheme()
  const { openPanel }             = useSidePanel()

  const appearance: AppearanceMode = (theme as AppearanceMode) ?? 'dark'

  const close = useCallback(() => setIsOpen(false), [])

  // 텍스트 크기 → html data-text-size 적용
  useEffect(() => {
    document.documentElement.dataset.textSize = textSize
    localStorage.setItem('text-size', textSize)
  }, [textSize])

  // 초기 로드 시 저장값 복원
  useEffect(() => {
    const saved = localStorage.getItem('text-size') as TextSize | null
    if (saved && saved !== 'default') {
      setTextSize(saved)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      ) return
      close()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, close])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; fontSize: string }[] = [
    { value: 'default', label: 'Default', fontSize: '18px' },
    { value: 'large',   label: 'Large',   fontSize: '22px' },
    { value: 'larger',  label: 'Larger',  fontSize: '28px' },
  ]

  const APPEARANCE_OPTIONS: { value: AppearanceMode; label: string }[] = [
    { value: 'light',  label: 'Light'  },
    { value: 'dark',   label: 'Dark'   },
    { value: 'system', label: 'System' },
  ]

  return (
    <>
      {/* Mobile menu button — same position as gear button, visible on mobile only */}
      <button
        className="settings-button__btn settings-button__btn--menu"
        onClick={openPanel}
        aria-label="Open menu"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" >
          <line x1="3" y1="5.5"  x2="21" y2="5.5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12"   x2="21" y2="12"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="18.5" x2="21" y2="18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Gear button */}
      <button
        ref={btnRef}
        className="settings-button__btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close settings' : 'Open settings'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <svg
          className={`settings-button__icon${isOpen ? ' settings-button__icon--spin' : ''}`}
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Settings panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="settings-button__panel"
          role="dialog"
          aria-label="Display settings"
          aria-modal="false"
        >
          {/* ── Text Size ── */}
          <section className="settings-button__section" aria-labelledby="settings-text-size-label">
            <h3 className="settings-button__section-title" id="settings-text-size-label">
              Text Size
            </h3>
            <div className="settings-button__option-group" role="group" aria-label="Text size options">
              {TEXT_SIZE_OPTIONS.map(({ value, label, fontSize }) => (
                <button
                  key={value}
                  className={`settings-button__option${textSize === value ? ' settings-button__option--active' : ''}`}
                  onClick={() => setTextSize(value)}
                  aria-pressed={textSize === value}
                  aria-label={`Text size: ${label}`}
                >
                  <span
                    className="settings-button__option-preview settings-button__option-preview--text"
                    style={{ fontSize }}
                    aria-hidden="true"
                  >
                    A
                  </span>
                  <span className="settings-button__option-label">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="settings-button__divider" role="separator" />

          {/* ── Appearance ── */}
          <section className="settings-button__section" aria-labelledby="settings-appearance-label">
            <h3 className="settings-button__section-title" id="settings-appearance-label">
              Appearance
            </h3>
            <div className="settings-button__option-group" role="group" aria-label="Appearance options">
              {APPEARANCE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`settings-button__option${appearance === value ? ' settings-button__option--active' : ''}`}
                  onClick={() => setTheme(value)}
                  aria-pressed={appearance === value}
                  aria-label={`Appearance: ${label}`}
                >
                  <span
                    className={`settings-button__option-preview settings-button__option-preview--theme settings-button__option-preview--${value}`}
                    aria-hidden="true"
                  />
                  <span className="settings-button__option-label">{label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
