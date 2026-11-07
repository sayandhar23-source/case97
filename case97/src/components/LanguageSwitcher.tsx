'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { localeLabels, locales, type AppLocale } from '@/lib/locales'

export function LanguageSwitcher({ locale, label }: { locale: AppLocale; label: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()

  const change = (next: string) => {
    const parts = pathname.split('/')
    parts[1] = next
    const qs = search.toString()
    document.cookie = `c97-locale=${next}; path=/; max-age=31536000; samesite=lax`
    router.push(parts.join('/') + (qs ? `?${qs}` : ''))
  }

  return (
    <label className="lang">
      <span className="sr-only">{label}</span>
      <select value={locale} onChange={(e) => change(e.target.value)}>
        {locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
    </label>
  )
}
