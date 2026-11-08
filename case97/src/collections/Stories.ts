import type { CollectionConfig } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdmin, publishedOrAdmin } from '../access'
import { storyBlocks } from '../blocks/storyBlocks'
import { formatSlug } from '../hooks/slug'
import { setCaseNumber, setPublishedAt, setReadingTime } from '../hooks/stories'
import { themeOptions } from '../lib/themes'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'theme', '_status', 'updatedAt'],
  },
  versions: { drafts: true, maxPerDoc: 25 }, // draft / publish + version history
  access: { read: publishedOrAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { beforeChange: [setCaseNumber, setReadingTime, setPublishedAt] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'Shown on cards and in Google results (≈160 characters).' },
            },
            { name: 'coverImage', type: 'relationship', relationTo: 'media', required: true },
            {
              name: 'body',
              type: 'richText',
              required: true,
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({ blocks: storyBlocks }),
                ],
              }),
            },
          ],
        },
        {
          label: 'Place & theme',
          fields: [
            { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
            { name: 'place', type: 'relationship', relationTo: 'places' },
            { name: 'theme', type: 'select', required: true, defaultValue: 'chronicle', options: themeOptions },
            {
              name: 'creepinessLevel',
              type: 'number',
              min: 0,
              max: 5,
              admin: {
                description: '0 = calm, 5 = sleep with the lights on',
                condition: (data) => ['haunted', 'mystery'].includes(data?.theme),
              },
            },
            { name: 'tags', type: 'text', hasMany: true },
            {
              name: 'relatedStories',
              type: 'relationship',
              relationTo: 'stories',
              hasMany: true,
              admin: { description: 'Optional. Leave empty to auto-suggest by place and category.' },
            },
          ],
        },
        {
          label: 'Audio',
          fields: [
            {
              name: 'audio',
              type: 'group',
              localized: true, // a separate narration per language
              fields: [
                { name: 'file', type: 'upload', relationTo: 'audio' },
                {
                  name: 'source',
                  type: 'select',
                  options: [
                    { label: 'AI narration (TTS)', value: 'tts' },
                    { label: 'Recorded narration', value: 'recorded' },
                  ],
                },
                { name: 'voice', type: 'text', admin: { description: 'TTS voice or narrator name' } },
                { name: 'durationSeconds', type: 'number' },
                { name: 'generatedAt', type: 'date', admin: { readOnly: true } },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'metaTitle', type: 'text', localized: true },
                { name: 'metaDescription', type: 'textarea', localized: true },
                { name: 'ogImage', type: 'relationship', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
    // Sidebar
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: { beforeValidate: [formatSlug('title')] },
    },
    {
      name: 'caseNumber',
      type: 'number',
      unique: true,
      admin: { position: 'sidebar', description: 'Shown as “Case No. 014”. Assigned automatically.' },
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'premiumOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Whole story locked for free readers (audio is always premium).' },
    },
    {
      name: 'readingTimeMinutes',
      type: 'number',
      localized: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
