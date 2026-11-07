import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Media, Reader, SiteSetting, Story } from '@/payload-types'
import { hasPremium, type AppUser } from '@/access'
import type { AppLocale } from './locales'

export const getPayloadClient = () => getPayload({ config })

export type Viewer = {
  user: AppUser
  reader: Reader | null
  isAdmin: boolean
  isPremium: boolean
}

// Who is looking at the page (a reader, the admin, or nobody). Cached per request.
export const getViewer = cache(async (): Promise<Viewer> => {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  const u = (user ?? null) as unknown as AppUser
  return {
    user: u,
    reader: u?.collection === 'readers' ? (user as unknown as Reader) : null,
    isAdmin: u?.collection === 'admins',
    isPremium: hasPremium(u),
  }
})

export const getSettings = cache(async (locale: AppLocale): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 2 })
})

export const getCategories = cache(async (locale: AppLocale): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'categories', locale, limit: 50, sort: 'name', depth: 0 })
  return res.docs
})

export const getStories = cache(
  async (locale: AppLocale, opts: { limit?: number; category?: string; page?: number } = {}) => {
    const payload = await getPayloadClient()
    return payload.find({
      collection: 'stories',
      locale,
      depth: 1,
      limit: opts.limit ?? 12,
      page: opts.page ?? 1,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
        ...(opts.category ? { 'category.slug': { equals: opts.category } } : {}),
      },
    })
  },
)

export const getStoryBySlug = cache(async (locale: AppLocale, slug: string): Promise<Story | null> => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'stories',
    locale,
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return res.docs[0] ?? null
})

export const getRelated = cache(async (locale: AppLocale, story: Story): Promise<Story[]> => {
  const picked = (story.relatedStories ?? []).filter((s): s is Story => typeof s === 'object')
  if (picked.length) return picked.slice(0, 3)
  const payload = await getPayloadClient()
  const categoryId = typeof story.category === 'object' ? story.category.id : story.category
  const res = await payload.find({
    collection: 'stories',
    locale,
    depth: 1,
    limit: 3,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' }, id: { not_equals: story.id }, category: { equals: categoryId } },
  })
  if (res.docs.length >= 3) return res.docs
  const more = await payload.find({
    collection: 'stories',
    locale,
    depth: 1,
    limit: 3,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' }, id: { not_in: [story.id, ...res.docs.map((d) => d.id)] } },
  })
  return [...res.docs, ...more.docs].slice(0, 3)
})

// Picks the best stored size of an image and returns its URL.
export const imageUrl = (
  media: Media | string | number | null | undefined,
  size: 'thumbnail' | 'card' | 'page' | 'hero' = 'card',
): string | null => {
  if (!media || typeof media !== 'object') return null
  return media.sizes?.[size]?.url || media.url || null
}

export const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' ? (m as Media) : null)
