import Link from 'next/link'
import { Suspense } from 'react'
import type { Category } from '@/payload-types'
import type { AppLocale } from '@/lib/locales'
import type { Dict } from '@/lib/i18n'
import type { Viewer } from '@/lib/payload'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header({ locale, t, viewer, categories }: { locale: AppLocale; t: Dict; viewer: Viewer; categories: Category[] }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href={`/${locale}`} className="logo" aria-label="Case97 home">
          <span className="logo-mark" aria-hidden="true">97</span>
          CASE97
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href={`/${locale}/stories`}>{t.nav.stories}</Link>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} href={`/${locale}/stories?category=${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Suspense fallback={null}>
            <LanguageSwitcher locale={locale} label={t.nav.language} />
          </Suspense>
          {viewer.isAdmin ? (
            <a className="btn btn-ghost" href="/admin">Admin</a>
          ) : viewer.reader ? (
            <Link className="btn btn-ghost" href={`/${locale}/account`}>{t.nav.account}</Link>
          ) : (
            <Link className="btn btn-ghost" href={`/${locale}/login`}>{t.nav.signIn}</Link>
          )}
          {!viewer.isPremium && (
            <Link className="btn btn-ember hide-sm" href={`/${locale}/premium`}>{t.nav.premium}</Link>
          )}
        </div>
      </div>
    </header>
  )
}
