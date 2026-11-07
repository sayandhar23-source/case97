import Link from 'next/link'
import type { Story } from '@/payload-types'
import type { AppLocale } from '@/lib/locales'
import { formatNumber, type Dict } from '@/lib/i18n'
import { imageUrl } from '@/lib/payload'

export function StoryCard({ story, locale, t }: { story: Story; locale: AppLocale; t: Dict }) {
  const img = imageUrl(story.coverImage, 'card')
  const alt = typeof story.coverImage === 'object' ? story.coverImage.alt : ''
  const place = typeof story.place === 'object' && story.place ? story.place : null
  return (
    <Link href={`/${locale}/stories/${story.slug}`} className="card">
      <div className="card-img">{img && <img src={img} alt={alt} loading="lazy" />}</div>
      <span className="case-tag">
        {t.themes[story.theme]} · {t.common.caseNo} {formatNumber(story.caseNumber ?? 0, locale, 3)}
      </span>
      <h3>{story.title}</h3>
      <span className="card-meta">
        {[place ? `${place.name}${place.region ? `, ${place.region}` : ''}` : null,
          story.readingTimeMinutes ? `${formatNumber(story.readingTimeMinutes, locale)} ${t.common.minRead}` : null]
          .filter(Boolean)
          .join(' · ')}
      </span>
    </Link>
  )
}
