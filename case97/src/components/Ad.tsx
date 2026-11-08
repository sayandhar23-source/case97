import type { SiteSetting } from '@/payload-types'
import type { Viewer } from '@/lib/payload'
import { AdSlot } from './AdSlot'

// Decides whether an ad shows: never for Premium, only when ads are switched on
// in Site Settings. In development, an empty slot shows where the ad will go.
export function Ad({ settings, viewer, slot, label }: {
  settings: SiteSetting
  viewer: Viewer
  slot: 'slotHomeBanner' | 'slotInArticle'
  label: string
}) {
  if (viewer.isPremium) return null
  const ads = settings.ads
  const slotId = ads?.[slot]
  if (ads?.enabled && ads.adsenseClientId && slotId) {
    return <AdSlot client={ads.adsenseClientId} slot={slotId} label={label} />
  }
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="ad">
        <div className="ad-inner"><span className="ad-label">{label}</span>AdSense slot (hidden for Premium, set IDs in Site Settings)</div>
      </div>
    )
  }
  return null
}
