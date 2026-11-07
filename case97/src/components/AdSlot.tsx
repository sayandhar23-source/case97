'use client'

import { useEffect } from 'react'

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

// One Google AdSense unit. Only rendered for non-premium readers.
export function AdSlot({ client, slot, label }: { client: string; slot: string; label: string }) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* ad blockers make this throw; the page still works */
    }
  }, [])
  return (
    <div className="ad" role="complementary" aria-label={label}>
      <div className="ad-label">{label}</div>
      <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  )
}
