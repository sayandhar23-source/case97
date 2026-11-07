import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true, update: isAdmin },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Case97' },
    { name: 'tagline', type: 'text', localized: true },
    {
      name: 'featuredStories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
      admin: { description: 'Hero carousel on the homepage, in this order.' },
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['instagram', 'facebook', 'x', 'youtube', 'tiktok', 'pinterest', 'threads'].map((p) => ({
            label: p,
            value: p,
          })),
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'discordInvite', type: 'text' },
    {
      name: 'ads',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        { name: 'adsenseClientId', type: 'text', admin: { description: 'ca-pub-XXXXXXXXXXXXXXXX' } },
        {
          type: 'row',
          fields: [
            { name: 'slotHomeBanner', type: 'text', admin: { description: 'Ad unit ID for the homepage banner' } },
            { name: 'slotInArticle', type: 'text', admin: { description: 'Ad unit ID shown between chapters' } },
          ],
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      admin: { description: 'Display prices only. Real charges are set in Razorpay and Paddle.' },
      fields: [
        { name: 'inrMonthly', type: 'number', defaultValue: 299 },
        { name: 'usdMonthly', type: 'number', defaultValue: 4.99 },
        { name: 'eurMonthly', type: 'number', defaultValue: 4.99 },
      ],
    },
  ],
}
