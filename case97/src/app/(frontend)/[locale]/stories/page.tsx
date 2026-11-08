import Link from 'next/link'
import type { Metadata } from 'next'
import { StoryCard } from '@/components/StoryCard'
import { getDict, toLocale } from '@/lib/i18n'
import { getCategories, getStories } from '@/lib/payload'

export const metadata: Metadata = { title: 'Stories' }

export default async function StoriesPage({ params, searchParams }: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const locale = toLocale((await params).locale)
  const { category, page } = await searchParams
  const t = getDict(locale)
  const pageNum = Math.max(1, Number(page) || 1)
  const [categories, stories] = await Promise.all([
    getCategories(locale),
    getStories(locale, { limit: 12, category, page: pageNum }),
  ])
  const active = categories.find((c) => c.slug === category)
  const qs = (p: number) => `?${new URLSearchParams({ ...(category ? { category } : {}), page: String(p) })}`

  return (
    <section className="wrap page">
      <h1>{active?.name ?? t.common.allStories}</h1>
      {active?.description && <p className="intro">{active.description}</p>}
      <nav className="chips" style={{ paddingTop: 0, marginBottom: 36 }} aria-label={t.nav.stories}>
        <Link className="chip" href={`/${locale}/stories`} aria-current={!category ? 'page' : undefined}>{t.common.allStories}</Link>
        {categories.map((c) => (
          <Link key={c.id} className="chip" href={`/${locale}/stories?category=${c.slug}`} aria-current={c.slug === category ? 'page' : undefined}>{c.name}</Link>
        ))}
      </nav>
      {stories.docs.length ? (
        <div className="grid">{stories.docs.map((s) => <StoryCard key={s.id} story={s} locale={locale} t={t} />)}</div>
      ) : (
        <p className="empty">{t.home.empty}</p>
      )}
      {stories.totalPages > 1 && (
        <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }} aria-label="Pages">
          {stories.hasPrevPage && <Link className="btn btn-ghost" href={qs(pageNum - 1)}>←</Link>}
          <span style={{ alignSelf: 'center', color: 'var(--ash)' }}>{pageNum} / {stories.totalPages}</span>
          {stories.hasNextPage && <Link className="btn btn-ghost" href={qs(pageNum + 1)}>→</Link>}
        </nav>
      )}
    </section>
  )
}
