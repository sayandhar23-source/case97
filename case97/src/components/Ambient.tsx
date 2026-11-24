'use client'

import { useEffect, useRef, useState } from 'react'

const FIREFLIES = [
  { x: '12%', y: '22%', d: '14s', delay: '-2s' }, { x: '28%', y: '68%', d: '18s', delay: '-9s' },
  { x: '44%', y: '35%', d: '16s', delay: '-5s' }, { x: '58%', y: '78%', d: '20s', delay: '-12s' },
  { x: '71%', y: '28%', d: '15s', delay: '-7s' }, { x: '84%', y: '60%', d: '19s', delay: '-3s' },
  { x: '92%', y: '18%', d: '17s', delay: '-10s' }, { x: '6%', y: '84%', d: '21s', delay: '-6s' },
]

// The ambient light layer. It sits over the whole page and never blocks clicks.
// Colours come from the page's theme (see SetAmbientTheme and the CSS variables).
export function AmbientLight() {
  const ref = useRef<HTMLDivElement>(null)

  // Lantern: a soft light that follows the mouse (desktop only, not with reduced motion).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return
    let frame = 0
    let x = 0
    let y = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
        el.dataset.lantern = 'on'
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      <i className="amb amb-a" />
      <i className="amb amb-b" />
      <i className="amb amb-c" />
      <i className="amb-lantern" />
      {FIREFLIES.map((f, i) => (
        <i key={i} className="fly" style={{ ['--x' as string]: f.x, ['--y' as string]: f.y, ['--d' as string]: f.d, ['--delay' as string]: f.delay }} />
      ))}
    </div>
  )
}

// Header button: turn the ambient light on or off. The choice is remembered.
export function AmbientToggle({ label }: { label: string }) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    setOn(document.documentElement.dataset.ambient !== 'off')
  }, [])
  const toggle = () => {
    const next = !on
    setOn(next)
    document.documentElement.dataset.ambient = next ? 'on' : 'off'
    try {
      localStorage.setItem('c97-ambient', next ? 'on' : 'off')
    } catch {}
  }
  return (
    <button type="button" className="icon-btn" aria-pressed={on} aria-label={label} title={label} onClick={toggle}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6" /><path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" />
      </svg>
    </button>
  )
}

// Tells the ambient layer which colours to use for the page being shown.
export function SetAmbientTheme({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.dataset.ambientTheme = theme
    return () => {
      delete document.documentElement.dataset.ambientTheme
    }
  }, [theme])
  return null
}
