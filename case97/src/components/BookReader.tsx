'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type Labels = { prev: string; next: string; pages: string; of: string }

// A two-page book with a 3D page turn (one page on narrow screens).
export function BookReader({ pages, labels }: { pages: ReactNode[]; labels: Labels }) {
  const [single, setSingle] = useState(false)
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState<null | 'next' | 'prev'>(null)
  const [turning, setTurning] = useState(false)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const update = () => { setSingle(mq.matches); setIndex(0) }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const all = single || pages.length % 2 === 0 ? pages : [...pages, null]
  const step = single ? 1 : 2
  const total = all.length
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = useCallback(
    (dir: 'next' | 'prev') => {
      if (turn) return
      if (dir === 'next' && index + step >= total) return
      if (dir === 'prev' && index === 0) return
      if (reduce || (single && dir === 'prev')) {
        setIndex((i) => (dir === 'next' ? i + step : i - step))
        return
      }
      setTurn(dir)
      requestAnimationFrame(() => requestAnimationFrame(() => setTurning(true)))
      window.setTimeout(() => {
        setIndex((i) => (dir === 'next' ? i + step : i - step))
        setTurn(null)
        setTurning(false)
      }, 760)
    },
    [turn, index, step, total, reduce, single],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return
      if (e.key === 'ArrowRight') go('next')
      if (e.key === 'ArrowLeft') go('prev')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const page = (i: number, side: 'left' | 'right', key?: string) => (
    <div className={`book-page ${side}`} key={key}>
      {all[i] ?? null}
      {all[i] !== null && i < total ? <span className="folio">{i + 1}</span> : null}
    </div>
  )

  // What sits underneath while a leaf is turning.
  const leftIdx = single ? index : turn === 'prev' ? index - 2 : index
  const rightIdx = single ? (turn === 'next' ? index + 1 : index) : turn === 'next' ? index + 3 : index + 1

  const shown = Math.min(total, index + step)
  return (
    <div className="book-stage">
      <div
        className={`book${single ? ' single' : ''}`}
        onPointerDown={(e) => { startX.current = e.clientX }}
        onPointerUp={(e) => {
          if (startX.current === null) return
          const dx = e.clientX - startX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 'next' : 'prev')
          startX.current = null
        }}
      >
        <div className="book-shadow" />
        {!single && page(leftIdx, 'left', 'l')}
        {page(rightIdx, 'right', 'r')}
        {turn && (
          <div className={`leaf ${turn}${turning ? ' turning' : ''}`}>
            <div className="face front">
              {single ? page(index, 'right') : turn === 'next' ? page(index + 1, 'right') : page(index, 'left')}
            </div>
            <div className="face back">
              {single ? <div className="book-page right" /> : turn === 'next' ? page(index + 2, 'left') : page(index - 1, 'right')}
            </div>
          </div>
        )}
      </div>
      <div className="book-controls">
        <button type="button" className="tool" onClick={() => go('prev')} disabled={index === 0}>{labels.prev}</button>
        <div className="book-progress" aria-live="polite">
          <div className="track"><i style={{ width: `${(shown / total) * 100}%` }} /></div>
          <span>{labels.pages} {index + 1}{step === 2 ? `–${shown}` : ''} {labels.of} {total}</span>
        </div>
        <button type="button" className="tool tool-accent" onClick={() => go('next')} disabled={index + step >= total}>{labels.next}</button>
      </div>
    </div>
  )
}
