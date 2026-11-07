import Link from 'next/link'
import type { Place, Story } from '@/payload-types'
import { Ad } from '@/components/Ad'
import { StoryCard } from '@/components/StoryCard'
import { IconCheck, IconHeadphones } from '@/components/Icons'
import { formatNumber, getDict, toLocale } from '@/lib/i18n'
import { getCategories, getSettings, getStories, getViewer, imageUrl } from '@/lib/payload'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale)
  const t = getDict(locale)
  const [settings, viewer, categories, latest] = await Promise.all([
    getSettings(locale),
    getViewer(),
    getCategories(locale),
    getStories(locale, { limit: 9 }),
  ])

  const featured =
    (settings.featuredStories ?? []).find((s): s is Story => typeof s === 'object' && s?._status === 'published') ??
    latest.docs.find((s) => s.isFeatured) ??
    latest.docs[0]
  const rest = latest.docs.filter((s) => s.id !== featured?.id).slice(0, 6)
  const places = latest.docs
    .map((s) => ({ story: s, place: typeof s.place === 'object' ? (s.place as Place | null) : null }))
    .filter((p): p is { story: Story; place: Place } => !!p.place)
    .slice(0, 6)
  const pricing = settings.pricing

  if (!featured) {
    return <section className="wrap section"><p className="empty">{t.home.empty}</p></section>
  }

  const heroImg = imageUrl(featured.coverImage, 'hero')
  const heroAlt = typeof featured.coverImage === 'object' ? featured.coverImage.alt : ''
  const place = typeof featured.place === 'object' ? featured.place : null

  return (
    <>
      <section className="hero">
        <div className="fog" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div>
            <p className="case-tag">
              {t.common.caseNo} {formatNumber(featured.caseNumber ?? 0, locale, 3)}
              {place ? ` · ${place.name}` : ''}
            </p>
            <h1>{featured.title}</h1>
            <p className="lede">{featured.excerpt}</p>
            <div className="actions">
              <Link className="btn btn-solid" href={`/${locale}/stories/${featured.slug}`}>{t.home.read}</Link>
              {featured.audio?.file ? (
                <Link className="btn btn-ghost" href={viewer.isPremium ? `/${locale}/stories/${featured.slug}` : `/${locale}/premium`}>
                  <IconHeadphones /> {t.home.listen}
                </Link>
              ) : null}
            </div>
            <p className="meta">
              {featured.readingTimeMinutes ? `${formatNumber(featured.readingTimeMinutes, locale)} ${t.common.minRead}` : ''}
              {featured.creepinessLevel ? ` · ${t.common.creepiness} ${formatNumber(featured.creepinessLevel, locale)}/${formatNumber(5, locale)}` : ''}
            </p>
          </div>
          <div className="hero-figure">{heroImg && <img src={heroImg} alt={heroAlt} />}</div>
        </div>
      </section>

      <nav className="wrap chips" aria-label={t.nav.stories}>
        <Link className="chip" href={`/${locale}/stories`} aria-current="page">{t.common.allStories}</Link>
        {categories.map((c) => (
          <Link key={c.id} className="chip" href={`/${locale}/stories?category=${c.slug}`}>{c.name}</Link>
        ))}
      </nav>

      <div style={{ paddingTop: 36 }}>
        <Ad settings={settings} viewer={viewer} slot="slotHomeBanner" label={t.common.ad} />
      </div>

      {rest.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <h2>{t.home.latest}</h2>
            <Link href={`/${locale}/stories`}>{t.home.viewAll}</Link>
          </div>
          <div className="grid">
            {rest.map((s) => <StoryCard key={s.id} story={s} locale={locale} t={t} />)}
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="band">
          <div className="wrap section band-grid">
            <div>
              <h2>{t.home.mapTitle}</h2>
              <p>{t.home.mapBody}</p>
              <Link className="btn btn-ghost" href={`/${locale}/stories`}>{t.home.mapCta}</Link>
            </div>
            <div className="place-strip">
              {places.map(({ story, place }) => (
                <Link key={story.id} href={`/${locale}/stories/${story.slug}`}>
                  <strong>{place.name}</strong>
                  <small>{[place.region, place.country].filter(Boolean).join(', ')}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!viewer.isPremium && (
        <section className="wrap section band-grid">
          <div>
            <h2 style={{ font: '600 clamp(34px,4.4vw,52px)/1.05 var(--f-display)', margin: '0 0 14px' }}>{t.home.premiumTitle}</h2>
            <p style={{ color: 'var(--bone-2)', fontSize: 17, margin: 0, maxWidth: '32em' }}>{t.home.premiumBody}</p>
          </div>
          <div className="price-card">
            <div className="price">₹{pricing?.inrMonthly ?? 299}<small>{t.premium.perMonth} {t.premium.india}</small></div>
            <div style={{ color: 'var(--bone-2)' }}>${pricing?.usdMonthly ?? 4.99} · €{pricing?.eurMonthly ?? 4.99} {t.premium.perMonth} {t.premium.intl}</div>
            <ul className="ticks">
              {t.premium.features.map((f) => <li key={f}><IconCheck />{f}</li>)}
            </ul>
            <Link className="btn btn-ember" href={`/${locale}/premium`}>{t.home.premiumCta}</Link>
          </div>
        </section>
      )}
    </>
  )
}
