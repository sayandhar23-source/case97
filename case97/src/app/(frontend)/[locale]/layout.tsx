import '../styles.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getDict, isLocale } from '@/lib/i18n'
import { getCategories, getSettings, getViewer } from '@/lib/payload'

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=IM+Fell+English:ital@0;1&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Grotesk:wght@500;600;700&family=Tiro+Bangla:ital@0;1&family=Noto+Serif+Bengali:wght@400;500&family=Hind+Siliguri:wght@400;500;600&display=swap'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: { default: 'Case97 — real stories of haunted and historical places', template: '%s · Case97' },
  description: 'Real stories of historical and haunted places, in English, French, Spanish and Bengali.',
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) redirect('/en')
  const locale = raw
  const t = getDict(locale)
  const [settings, viewer, categories] = await Promise.all([getSettings(locale), getViewer(), getCategories(locale)])
  const ads = settings.ads
  const loadAds = Boolean(ads?.enabled && ads.adsenseClientId && !viewer.isPremium)

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <a className="sr-only" href="#main">Skip to content</a>
        <Header locale={locale} t={t} viewer={viewer} categories={categories} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t} settings={settings} />
        {loadAds && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads!.adsenseClientId}`}
          />
        )}
      </body>
    </html>
  )
}
