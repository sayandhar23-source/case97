import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

// The site owner's login for /admin. Exactly ONE account can ever exist:
// the first one is created on the /admin welcome screen, and every later
// attempt (admin panel, API or scripts) is refused.
export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: { singular: 'Admin', plural: 'Admin' },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 12, // 12 hours
  },
  admin: {
    useAsTitle: 'email',
    group: 'Settings',
    description: 'Your owner account. Only one admin can exist.',
  },
  access: {
    admin: ({ req }) => req.user?.collection === 'admins',
    create: () => false, // the first-account screen bypasses this once
    read: ({ req }) => (req.user?.collection === 'admins' ? { id: { equals: req.user.id } } : false),
    update: ({ req }) => (req.user?.collection === 'admins' ? { id: { equals: req.user.id } } : false),
    delete: () => false,
  },
  hooks: {
    beforeChange: [
      async ({ operation, req, data }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'admins', overrideAccess: true, req })
          if (totalDocs > 0) throw new APIError('An admin account already exists.', 403)
        }
        return data
      },
    ],
  },
  fields: [{ name: 'name', type: 'text' }],
}
