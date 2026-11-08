'use server'

import type { Reader } from '@/payload-types'
import { getPayloadClient, getViewer } from '@/lib/payload'

export async function toggleWishlist(storyId: string | number): Promise<{ ok: boolean; saved?: boolean; reason?: 'signin' }> {
  const viewer = await getViewer()
  if (!viewer.reader) return { ok: false, reason: 'signin' }
  const payload = await getPayloadClient()
  const reader = await payload.findByID({ collection: 'readers', id: viewer.reader.id, depth: 0, overrideAccess: true })
  const ids = (reader.wishlist ?? []).map((w) => (typeof w === 'object' && w ? w.id : w))
  const has = ids.some((id) => String(id) === String(storyId))
  const next = has ? ids.filter((id) => String(id) !== String(storyId)) : [...ids, storyId]
  await payload.update({
    collection: 'readers',
    id: viewer.reader.id,
    data: { wishlist: next as NonNullable<Reader['wishlist']> },
    overrideAccess: true,
  })
  return { ok: true, saved: !has }
}
