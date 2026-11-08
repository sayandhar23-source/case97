'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { BookReader } from './BookReader'

type Labels = { book: string; scroll: string; prev: string; next: string; pages: string; of: string; readingMode: string }

// Switches between scroll reading and the book. The choice is remembered.
export function StoryReader({ scroll, pages, tools, labels }: { scroll: ReactNode; pages: ReactNode[]; tools: ReactNode; labels: Labels }) {
  const [mode, setMode] = useState<'scroll' | 'book'>('scroll')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('c97-reading-mode')
      if (saved === 'book' || saved === 'scroll') setMode(saved)
    } catch {}
  }, [])

  const choose = (m: 'scroll' | 'book') => {
    setMode(m)
    try { localStorage.setItem('c97-reading-mode', m) } catch {}
  }

  return (
    <>
      <div className="wrap">
        <div className="toolbar">
          <div className="seg" role="group" aria-label={labels.readingMode}>
            <button type="button" aria-pressed={mode === 'book'} onClick={() => choose('book')}>{labels.book}</button>
            <button type="button" aria-pressed={mode === 'scroll'} onClick={() => choose('scroll')}>{labels.scroll}</button>
          </div>
          <div className="group">{tools}</div>
        </div>
      </div>
      {mode === 'scroll' ? (
        <div className="wrap"><div className="prose">{scroll}</div></div>
      ) : (
        <div className="wrap"><BookReader pages={pages} labels={labels} /></div>
      )}
    </>
  )
}
