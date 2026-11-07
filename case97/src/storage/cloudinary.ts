import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from 'cloudinary'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { buildStoragePathData, getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities'

/**
 * Payload storage adapter for Cloudinary.
 *
 * - Images: uploaded as public files and served straight from Cloudinary's CDN
 *   with automatic format (WebP/AVIF) and quality (f_auto,q_auto).
 * - Audio: uploaded as "authenticated" (private) files. Readers never get a
 *   Cloudinary link; Payload checks Premium access and streams the file.
 */

let configured = false
const configure = () => {
  if (configured) return
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    analytics: false, // no ?_a= tracking parameter on URLs
  })
  configured = true
}

export const cloudinaryEnabled = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

type Kind = 'image' | 'audio'

// "media/bhangarh-768x512.webp" -> "case97/media/bhangarh-768x512_webp".
// The extension is folded into the ID so x.jpg and x.png never overwrite each other.
const toPublicId = (storageFilePath: string) => {
  const folder = (process.env.CLOUDINARY_FOLDER || 'case97').replace(/^\/+|\/+$/g, '')
  const safe = storageFilePath.replace(/\./g, '_').replace(/[^A-Za-z0-9_\-/]/g, '_')
  return `${folder}/${safe}`
}

const optionsFor = (kind: Kind) =>
  kind === 'image'
    ? ({ resource_type: 'image', type: 'upload' } as const)
    : ({ resource_type: 'video', type: 'authenticated' } as const) // Cloudinary stores audio as "video"

export const cloudinaryAdapter =
  (kind: Kind): Adapter =>
  ({ collection, prefix = '' }) => ({
    name: `cloudinary-${kind}`,

    generateURL: ({ filename, prefix: docPrefix = '' }) => {
      configure()
      const { storageFilePath } = buildStoragePathData({ collectionPrefix: prefix, docPrefix, filename })
      if (kind === 'audio') return `/api/${collection.slug}/file/${encodeURIComponent(filename)}`
      return cloudinary.url(toPublicId(storageFilePath), {
        ...optionsFor('image'),
        secure: true,
        force_version: false, // clean URLs without /v1/
        fetch_format: 'auto',
        quality: 'auto',
      })
    },

    handleUpload: async ({ data, file, storageFilePath }) => {
      configure()
      const options: UploadApiOptions = {
        ...optionsFor(kind),
        public_id: toPublicId(storageFilePath),
        overwrite: true,
        invalidate: true,
      }
      if (file.tempFilePath) {
        await cloudinary.uploader.upload(file.tempFilePath, options)
      } else {
        await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(options, (err, res) => (err ? reject(err) : resolve(res)))
          stream.end(file.buffer)
        })
      }
      return data
    },

    handleDelete: async ({ storageFilePath }) => {
      configure()
      await cloudinary.uploader.destroy(toPublicId(storageFilePath), { ...optionsFor(kind), invalidate: true })
    },

    staticHandler: async (req, { doc, headers, params }) => {
      configure()
      try {
        const storageFilePath = await getStorageFilePath({
          collection,
          collectionPrefix: prefix,
          doc: doc as never,
          filename: params.filename,
          prefixQueryParam: params.prefix,
          req,
        })
        const publicId = toPublicId(storageFilePath)

        if (kind === 'image') {
          const url = cloudinary.url(publicId, { ...optionsFor('image'), secure: true, force_version: false, fetch_format: 'auto', quality: 'auto' })
          return Response.redirect(url, 302)
        }

        // Private audio: fetch with a signed URL and stream it (supports seeking).
        const signed = cloudinary.url(publicId, { ...optionsFor('audio'), secure: true, sign_url: true })
        const range = headers?.get('range') ?? req.headers.get('range')
        const upstream = await fetch(signed, { headers: range ? { range } : {} })
        if (!upstream.ok && upstream.status !== 206) return new Response('Not found', { status: 404 })
        const out = new Headers({ 'Cache-Control': 'private, no-store', 'Accept-Ranges': 'bytes' })
        for (const h of ['content-type', 'content-length', 'content-range']) {
          const v = upstream.headers.get(h)
          if (v) out.set(h, v)
        }
        return new Response(upstream.body, { status: upstream.status, headers: out })
      } catch (err) {
        req.payload.logger.error({ err, msg: '[cloudinary] could not serve file' })
        return new Response('Not found', { status: 404 })
      }
    },
  })
