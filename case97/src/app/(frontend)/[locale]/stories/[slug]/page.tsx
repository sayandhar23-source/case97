import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Audio, Place } from '@/payload-types'
import { Ad } from '@/components/Ad'
import { IconHeadphones, IconLock, IconPin } from '@/components/Icons'
import { MapEmbed, mapLinks } from '@/components/MapEmbed'
import { StoryCard } from '@/components/StoryCard'
import { StoryReader } from '@/components/StoryReader'
import { StoryRichText } from '@/components/StoryRichText'
import { WishlistButton } from '@/components/WishlistButton'
import { paginate, preview, type LexicalState } from '@/lib/book'
import { formatNumber, getDict, toLocale } from '@/lib/i18n'
import { localeLabels, locales } from '@/lib/locales'
import { getAvailableLocales, getRelated, getSettings, getStoryBySlug, getViewer, imageUrl } from '@/lib/payload'

type Params = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const story = await getStoryBySlug(toLocale(raw), slug)
  if (!story) return {}
  const og = imageUrl(story.seo?.ogImage ?? story.coverImage, 'hero')
  return {
    title: story.seo?.metaTitle || story.title,
    description: story.seo?.metaDescription || story.excerpt,
    alternates: { languages: { en: `/en/stories/${slug}`, fr: `/fr/stories/${slug}`, es: `/es/stories/${slug}`, bn: `/bn/stories/${slug}` } },
    openGraph: { title: story.title, description: story.excerpt, images: og ? [og] : [] },
  }
}

export default async function StoryPage({ params }: Params) {
  const { locale: raw, slug } = await params
  const locale = toLocale(raw)
  const t = getDict(locale)
  const story = await getStoryBySlug(locale, slug)
  if (!story) notFound()

  const [viewer, settings, related, available] = await Promise.all([getViewer(), getSettings(locale), getRelated(locale, story), getAvailableLocales(story.id)])
  const locked = Boolean(story.premiumOnly && !viewer.isPremium)
  const body = story.body as unknown as LexicalState
  const content = locked ? preview(body) : body
  const place = typeof story.place === 'object' ? (story.place as Place | null) : null
  const cover = imageUrl(story.coverImage, 'hero')
  const coverAlt = typeof story.coverImage === 'object' ? story.coverImage.alt : ''
  const audio = typeof story.audio?.file === 'object' ? (story.audio.file as Audio | null) : null
  const hasAudio = Boolean(story.audio?.file)
  const saved = (viewer.reader?.wishlist ?? []).some((w) => String(typeof w === 'object' ? w.id : w) === String(story.id))
  const caseNo = `${t.common.caseNo} ${formatNumber(story.caseNumber ?? 0, locale, 3)}`

  const titlePage = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
      <p className="case-tag" style={{ color: 'var(--accent)' }}>{caseNo}</p>
      <h2 style={{ font: '500 2.2em/1.1 var(--s-display)', margin: 0 }}>{story.title}</h2>
      <p style={{ fontStyle: 'italic', color: 'var(--muted)', margin: 0 }}>{story.excerpt}</p>
    </div>
  )
  const pages = [titlePage, ...paginate(content).map((p, i) => <StoryRichText key={i} data={p} />)]

  const meter = story.creepinessLevel ? (
    <span>
      {t.common.creepiness}
      <span className="meter" aria-label={`${story.creepinessLevel} / 5`}>
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= (story.creepinessLevel ?? 0) ? 'on' : ''} />)}
      </span>
    </span>
  ) : null

  return (
    <article className="story" data-theme={story.theme}>
      <header className="wrap story-head">
        <p className="case-tag">{t.themes[story.theme]} · {caseNo}{place ? ` · ${place.name}` : ''}</p>
        <h1>{story.title}</h1>
        <p className="lede">{story.excerpt}</p>
        <div className="story-meta">
          {story.readingTimeMinutes ? <span>{formatNumber(story.readingTimeMinutes, locale)} {t.common.minRead}</span> : null}
          {meter}
          {place ? <span><IconPin /> {[place.region, place.country].filter(Boolean).join(', ')}</span> : null}
        </div>
        <nav className="langbar" aria-label={t.story.readIn}>
          <span className="langbar-label">{t.story.readIn}</span>
          {locales.map((l) =>
            l === locale ? (
              <span key={l} lang={l} className="on" aria-current="true">{localeLabels[l]}</span>
            ) : available.includes(l) ? (
              <Link key={l} lang={l} hrefLang={l} href={`/${l}/stories/${story.slug}`}>{localeLabels[l]}</Link>
            ) : (
              <span key={l} lang={l} className="off" title={t.story.notTranslated}>{localeLabels[l]}</span>
            ),
          )}
        </nav>
        {!available.includes(locale) && (
          <p className="lang-notice" role="note">{t.story.fallbackNotice}</p>
        )}
      </header>
      {cover && <div className="wrap"><div className="story-cover"><img src={cover} alt={coverAlt} /></div></div>}

      <StoryReader
        scroll={<StoryRichText data={content} />}
        pages={pages}
        labels={{ book: t.story.book, scroll: t.story.scroll, prev: t.story.prev, next: t.story.next, pages: t.story.pages, of: t.story.of, readingMode: t.story.readingMode }}
        tools={
          <>
            <WishlistButton
              storyId={story.id}
              initialSaved={saved}
              signedIn={Boolean(viewer.reader)}
              loginHref={`/${locale}/login?next=/${locale}/stories/${story.slug}`}
              labels={{ save: t.story.save, saved: t.story.saved, signInToSave: t.story.signInToSave }}
            />
            {hasAudio && !viewer.isPremium && (
              <Link className="tool tool-accent" href={`/${locale}/premium`}><IconLock /> {t.story.listenPremium}</Link>
            )}
            {audio?.url && viewer.isPremium && (
              <div className="audio-bar">
                <IconHeadphones /> <audio controls preload="none" src={audio.url} />
              </div>
            )}
          </>
        }
      />

      {locked && (
        <div className="paywall">
          <h2>{t.story.lockedTitle}</h2>
          <p>{t.story.lockedBody}</p>
          <Link className="tool tool-accent" href={`/${locale}/premium`}>{t.story.lockedCta}</Link>
        </div>
      )}

      <div style={{ paddingBottom: 40 }}>
        <Ad settings={settings} viewer={viewer} slot="slotInArticle" label={t.common.ad} />
      </div>

      {place && (place.location || place.address) && (
        <section className="place-band">
          <div className="wrap place-grid">
            <div>
              <p className="case-tag" style={{ color: 'var(--accent)' }}>{t.story.where}</p>
              <h2>{place.name}</h2>
              {place.description && <p>{place.description}</p>}
              {place.visitingInfo && <p>{place.visitingInfo}</p>}
              <a className="tool tool-accent" href={mapLinks(place, locale).directions} target="_blank" rel="noopener noreferrer">{t.story.directions}</a>
            </div>
            <MapEmbed place={place} locale={locale} title={`${t.story.where}: ${place.name}`} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap related">
          <h2>{t.story.related}</h2>
          <div className="grid">{related.map((s) => <StoryCard key={s.id} story={s} locale={locale} t={t} />)}</div>
        </section>
      )}
    </article>
  )
}
