import dns from 'node:dns'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig, type Plugin } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Admins } from './collections/Admins'
import { Readers } from './collections/Readers'
import { Stories } from './collections/Stories'
import { Places } from './collections/Places'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Audio } from './collections/Audio'
import { SiteSettings } from './globals/SiteSettings'
import { defaultLocale, localeLabels, locales } from './lib/locales'
import { devConsoleEmail } from './lib/devEmail'

// Some ISPs/routers refuse the SRV lookups MongoDB Atlas needs.
// DNS_SERVERS in .env overrides them, e.g. DNS_SERVERS=1.1.1.1,8.8.8.8
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()))
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cloudflare R2 is used when its keys are in .env. Without them, uploads are
// saved to the project's /media and /audio folders, which is fine for development.
const r2Enabled = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_MEDIA_BUCKET &&
    process.env.R2_AUDIO_BUCKET,
)

const r2Config = {
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
}
const mediaPublicUrl = (process.env.R2_MEDIA_PUBLIC_URL || '').replace(/\/$/, '')

const storagePlugins: Plugin[] = r2Enabled
  ? [
      // Images: PUBLIC bucket, served straight from Cloudflare.
      s3Storage({
        collections: {
          media: {
            prefix: 'media',
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) =>
              `${mediaPublicUrl}/${[prefix, filename].filter(Boolean).join('/')}`,
          },
        },
        bucket: process.env.R2_MEDIA_BUCKET || '',
        config: r2Config,
      }),
      // Audio: PRIVATE bucket, only reachable through Payload's access control.
      s3Storage({
        collections: { audio: { prefix: 'audio' } },
        bucket: process.env.R2_AUDIO_BUCKET || '',
        config: r2Config,
      }),
    ]
  : []

// Brevo sends real emails when its SMTP key is in .env. Without it, emails
// (with their verification and password-reset links) are printed in the terminal.
const email = process.env.BREVO_SMTP_KEY
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'hello@example.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'Case97',
      skipVerify: process.env.NODE_ENV !== 'production',
      transportOptions: {
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: { user: process.env.BREVO_SMTP_LOGIN, pass: process.env.BREVO_SMTP_KEY },
      },
    })
  : devConsoleEmail

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: Admins.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Case97 Admin' },
  },
  collections: [Stories, Places, Categories, Media, Audio, Readers, Admins],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    defaultLocale,
    fallback: true, // untranslated fields fall back to English
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  sharp,
  email,
  plugins: storagePlugins,
})
