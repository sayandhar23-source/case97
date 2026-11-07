import type { Place } from '@/payload-types'
import type { AppLocale } from '@/lib/locales'

// Google Maps embed. With NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY set it uses the
// official (free, unlimited) Maps Embed API; otherwise the basic keyless embed.
export function mapLinks(place: Place, locale: AppLocale) {
  const [lng, lat] = place.location ?? [null, null]
  const hasPoint = typeof lat === 'number' && typeof lng === 'number'
  const query = hasPoint ? `${lat},${lng}` : encodeURIComponent(place.address || place.name)
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
  const embed = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${place.googlePlaceId ? `place_id:${place.googlePlaceId}` : query}&language=${locale}`
    : `https://maps.google.com/maps?q=${query}&z=14&hl=${locale}&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}${place.googlePlaceId ? `&destination_place_id=${place.googlePlaceId}` : ''}`
  return { embed, directions }
}

export function MapEmbed({ place, locale, title }: { place: Place; locale: AppLocale; title: string }) {
  const { embed } = mapLinks(place, locale)
  return <iframe className="map" src={embed} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
}
