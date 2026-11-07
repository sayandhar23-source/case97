import type { CollectionConfig } from 'payload'
import { isAdmin, premiumOrAdmin } from '../access'

// Narration files live in a PRIVATE bucket. Only premium users (and staff)
// can stream them; the Audio phase will switch to short-lived signed URLs.
export const Audio: CollectionConfig = {
  slug: 'audio',
  access: { read: premiumOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  upload: {
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav'],
  },
  fields: [{ name: 'label', type: 'text', admin: { description: 'e.g. "Bhangarh Fort — Bengali"' } }],
}
