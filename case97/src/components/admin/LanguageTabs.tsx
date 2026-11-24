'use client'

import { useConfig, useDocumentInfo, useLocale } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAMES: Record<string, string> = { en: 'English', fr: 'Français', es: 'Español', bn: 'বাংলা' }

type StoryAllLocales = {
  title?: Record<string, string | null | undefined> | null
  body?: Record<string, { root?: { children?: unknown[] } } | null | undefined> | null
}

// Always-visible language tabs at the top of the story editor.
// Each tab shows whether that language has a title and text yet.
export function LanguageTabs() {
  const { config } = useConfig()
  const current = useLocale()
  const router = useRouter()
  const { id, lastUpdateTime } = useDocumentInfo()
  const [written, setWritten] = useState<Record<string, boolean> | null>(null)

  const codes = (config.localization ? config.localization.locales : []).map((l) => l.code)

  // Re-check after every save, so the ticks stay current.
  useEffect(() => {
    if (!id) {
      setWritten({})
      return
    }
    let stale = false
    fetch(`${config.routes.api}/stories/${id}?locale=all&fallbackLocale=false&depth=0&draft=true`, { credentials: 'include' })
      .then((r) => (r.ok ? (r.json() as Promise<StoryAllLocales>) : null))
      .then((doc) => {
        if (stale) return
        const result: Record<string, boolean> = {}
        for (const code of codes) {
          result[code] = Boolean(doc?.title?.[code]?.trim()) && (doc?.body?.[code]?.root?.children?.length ?? 0) > 0
        }
        setWritten(result)
      })
      .catch(() => !stale && setWritten({}))
    return () => {
      stale = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lastUpdateTime])

  if (!codes.length) return null

  const go = (code: string) => {
    if (code === current.code) return
    const params = new URLSearchParams(window.location.search)
    params.set('locale', code)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const emptyHere = written !== null && !written[current.code]

  return (
    <div
      style={{
        margin: '0 0 28px',
        padding: '16px 18px',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 6,
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 10 }}>Story language</div>
      <div role="tablist" aria-label="Story language" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {codes.map((code) => {
          const active = code === current.code
          const done = written?.[code]
          return (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => go(code)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                minWidth: 120,
                padding: '10px 16px',
                borderRadius: 6,
                cursor: active ? 'default' : 'pointer',
                font: 'inherit',
                border: `1px solid ${active ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-200)'}`,
                background: active ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-0)',
                color: active ? 'var(--theme-elevation-0)' : 'var(--theme-text)',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16 }}>{NAMES[code] ?? code}</span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>
                {written === null ? '…' : done ? '✓ Written' : '○ Not written yet'}
              </span>
            </button>
          )
        })}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}>
        You are editing the <strong>{NAMES[current.code] ?? current.code}</strong> version. Write its title, excerpt and text,
        save, then switch tabs for the next language. Click <strong>Publish changes</strong> to make every language live
        (<em>Save draft</em> keeps them hidden).
        {emptyHere && current.code !== 'en' && (
          <>
            {' '}
            Tip: the <strong>⋯</strong> menu at the top right has <strong>Copy to locale</strong>, which copies another
            language here so you can translate it in place.
          </>
        )}
      </p>
    </div>
  )
}
