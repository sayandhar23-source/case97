import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { formatSlug } from '../hooks/slug'

export const Places: CollectionConfig = {
  slug: 'places',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'country', 'region'] },
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
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text', required: true },
        { name: 'region', type: 'text', admin: { description: 'State / province' } },
      ],
    },
    {
      // Stored as [longitude, latitude] — enables "stories near me" queries later.
      name: 'location',
      type: 'point',
      admin: { description: 'Longitude first, then latitude (copy from Google Maps → right-click the spot).' },
    },
    {
      name: 'googlePlaceId',
      type: 'text',
      admin: { description: 'Optional. Gives the map embed the exact Google listing.' },
    },
    { name: 'address', type: 'text' },
    { name: 'description', type: 'textarea', localized: true },
    {
      name: 'visitingInfo',
      type: 'textarea',
      localized: true,
      admin: { description: 'Opening hours, entry fee, best time to visit.' },
    },
    { name: 'coverImage', type: 'relationship', relationTo: 'media' },
  ],
}
