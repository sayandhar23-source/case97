import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Media, Reader, SiteSetting, Story } from '@/payload-types'
import { hasPremium, type AppUser } from '@/access'
import { locales, type AppLocale } from './locales'

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

// Cloudinary resizes on the fly: we insert a transformation into the image link.
// f_auto/q_auto serve WebP or AVIF at the best quality for each visitor's device.
const SIZES = {
  thumbnail: 'c_fill,g_auto,w_400,h_300',
  card: 'c_fill,g_auto,w_768,h_512',
  page: 'c_limit,w_1200',
  hero: 'c_limit,w_1920',
} as const
const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/

export const imageUrl = (
  media: Media | string | number | null | undefined,
  size: keyof typeof SIZES = 'card',
): string | null => {
  if (!media || typeof media !== 'object' || !media.url) return null
  const m = media.url.match(CLOUDINARY)
  return m ? `${m[1]}${SIZES[size]},f_auto,q_auto/${m[2]}` : media.url
}

export const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' ? (m as Media) : null)

// Which languages a story is really written in (title and text both filled in).
// Without this check, untranslated stories silently fall back to English.
export const getAvailableLocales = cache(async (id: string | number): Promise<AppLocale[]> => {
  const payload = await getPayloadClient()
  const doc = await payload.findByID({ collection: 'stories', id, locale: 'all', fallbackLocale: false, depth: 0 })
  const title = (doc.title ?? {}) as unknown as Record<string, string | null | undefined>
  const body = (doc.body ?? {}) as unknown as Record<string, { root?: { children?: unknown[] } } | null | undefined>
  return locales.filter((l) => Boolean(title[l]?.trim()) && (body[l]?.root?.children?.length ?? 0) > 0)
})
