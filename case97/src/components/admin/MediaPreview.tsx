'use client'

import { useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

// Live preview under the "Image link" field in the admin panel.
export function MediaPreview() {
  const url = useFormFields(([fields]) => fields?.url?.value as string | undefined)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!url) {
    return <p style={{ margin: '0 0 24px', opacity: 0.7 }}>Paste an image link above to see a preview.</p>
  }
  if (failedUrl === url) {
    return (
      <p style={{ margin: '0 0 24px', color: 'var(--theme-error-500)' }}>
        This link doesn’t open an image. In Cloudinary, open the image and use “Copy URL”.
      </p>
    )
  }
  return (
    <div style={{ margin: '0 0 24px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        onError={() => setFailedUrl(url)}
        style={{ display: 'block', maxWidth: '100%', width: 480, maxHeight: 320, objectFit: 'cover', borderRadius: 4 }}
      />
    </div>
  )
}
