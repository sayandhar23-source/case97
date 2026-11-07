import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { formatSlug } from '../hooks/slug'
import { themeOptions } from '../lib/themes'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: { beforeValidate: [formatSlug('name')] },
    },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'defaultTheme',
      type: 'select',
      options: themeOptions,
      admin: { description: 'Pre-selected theme for new stories in this category.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
  ],
}
