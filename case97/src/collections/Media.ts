import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

// Images are hosted on Cloudinary (or any https image host). Upload the image in
// the Cloudinary dashboard, copy its link, and paste it here. The site stores only
// the link; Cloudinary makes the resized versions on the fly from it.
const validateUrl = (value: unknown): true | string => {
  if (typeof value !== 'string' || !value.trim()) return 'Paste the image link.'
  const v = value.trim()
  if (v.startsWith('/')) return true // images inside the site's /public folder
  if (!/^https:\/\/\S+$/i.test(v)) return 'Paste a full link starting with https://'
  if (/console\.cloudinary\.com|cloudinary\.com\/console/i.test(v)) {
    return 'That is the Cloudinary dashboard page, not the image. In Cloudinary, open the image and use “Copy URL” (it starts with https://res.cloudinary.com/).'
  }
  return true
}

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'url', 'updatedAt'],
    description: 'Upload the image in Cloudinary, copy its link, and paste it below.',
  },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      name: 'url',
      label: 'Image link',
      type: 'text',
      required: true,
      validate: validateUrl,
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)] },
      admin: { placeholder: 'https://res.cloudinary.com/your-cloud/image/upload/…' },
    },
    {
      name: 'preview',
      type: 'ui',
      admin: { components: { Field: '/components/admin/MediaPreview#MediaPreview' } },
    },
    { name: 'alt', label: 'Description (for screen readers and Google)', type: 'text', required: true, localized: true },
    { name: 'caption', type: 'text', localized: true },
    { name: 'credit', type: 'text', admin: { description: 'Photographer / source — needed for AdSense & copyright.' } },
  ],
}
