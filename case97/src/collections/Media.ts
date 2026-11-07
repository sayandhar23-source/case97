import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'card', width: 768, height: 512, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'page', width: 1200, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 80 } } },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'credit', type: 'text', admin: { description: 'Photographer / source — needed for AdSense & copyright.' } },
  ],
}
