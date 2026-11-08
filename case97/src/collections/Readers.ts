import type { CollectionConfig } from 'payload'
import { adminOrSelfReader, isAdmin, isAdminField } from '../access'
import { localeLabels, locales } from '../lib/locales'
import { resetPasswordEmail, verifyEmail } from '../lib/emails'

// Website accounts. Readers can never open /admin.
export const Readers: CollectionConfig = {
  slug: 'readers',
  labels: { singular: 'Reader', plural: 'Readers' },
  auth: {
    verify: {
      generateEmailSubject: ({ user }) => verifyEmail(user).subject,
      generateEmailHTML: ({ token, user }) => verifyEmail(user, token).html,
    },
    forgotPassword: {
      generateEmailSubject: (args) => resetPasswordEmail(args?.user).subject,
      generateEmailHTML: (args) => resetPasswordEmail(args?.user, args?.token).html,
    },
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 24 * 30, // stay signed in for 30 days
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'preferredLanguage', 'createdAt'],
  },
  access: {
    admin: () => false,
    create: () => true, // public registration
    read: adminOrSelfReader,
    update: adminOrSelfReader,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'preferredLanguage',
      type: 'select',
      defaultValue: 'en',
      options: locales.map((code) => ({ label: localeLabels[code], value: code })),
    },
    { name: 'wishlist', type: 'relationship', relationTo: 'stories', hasMany: true },
    {
      name: 'subscription',
      type: 'group',
      admin: {
        description: 'Updated automatically by Razorpay / Paddle. Edit only to grant premium manually.',
      },
      access: { create: isAdminField, update: isAdminField },
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Active', value: 'active' },
            { label: 'Past due (grace period)', value: 'past_due' },
            { label: 'Cancelled (until period end)', value: 'cancelled' },
            { label: 'Expired', value: 'expired' },
          ],
        },
        {
          name: 'provider',
          type: 'select',
          options: [
            { label: 'Razorpay (India)', value: 'razorpay' },
            { label: 'Paddle (international)', value: 'paddle' },
            { label: 'Manual', value: 'manual' },
          ],
        },
        {
          name: 'plan',
          type: 'select',
          options: [
            { label: '₹299 / month', value: 'monthly_inr' },
            { label: '$4.99 / month', value: 'monthly_usd' },
            { label: '€4.99 / month', value: 'monthly_eur' },
            { label: 'Yearly (INR)', value: 'yearly_inr' },
            { label: 'Yearly (USD)', value: 'yearly_usd' },
            { label: 'Yearly (EUR)', value: 'yearly_eur' },
          ],
        },
        { name: 'providerCustomerId', type: 'text' },
        { name: 'providerSubscriptionId', type: 'text', index: true },
        { name: 'currentPeriodEnd', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        {
          name: 'grantedManually',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Free premium (friends, promotions, testers).' },
        },
      ],
    },
  ],
}
