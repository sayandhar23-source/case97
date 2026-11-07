import Link from 'next/link'
import { IconCheck } from '@/components/Icons'
import { getDict, toLocale } from '@/lib/i18n'
import { getSettings, getViewer } from '@/lib/payload'

export const metadata = { title: 'Premium' }

export default async function PremiumPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale)
  const t = getDict(locale)
  const [settings, viewer] = await Promise.all([getSettings(locale), getViewer()])
  const p = settings.pricing

  return (
    <section className="wrap page">
      <h1>{t.premium.title}</h1>
      <p className="intro">{t.premium.intro}</p>
      <ul className="ticks" style={{ maxWidth: 560 }}>
        {t.premium.features.map((f) => <li key={f}><IconCheck />{f}</li>)}
      </ul>
      <div className="prices">
        <div className="price-card">
          <div className="price">₹{p?.inrMonthly ?? 299}<small>{t.premium.perMonth}</small></div>
          <p style={{ margin: 0, color: 'var(--bone-2)' }}>{t.premium.india}</p>
          <p style={{ margin: 0, color: 'var(--ash)', fontSize: 14 }}>{t.premium.payIndia}</p>
        </div>
        <div className="price-card">
          <div className="price">${p?.usdMonthly ?? 4.99} <span style={{ fontSize: 28 }}>/ €{p?.eurMonthly ?? 4.99}</span><small>{t.premium.perMonth}</small></div>
          <p style={{ margin: 0, color: 'var(--bone-2)' }}>{t.premium.intl}</p>
          <p style={{ margin: 0, color: 'var(--ash)', fontSize: 14 }}>{t.premium.payIntl}</p>
        </div>
      </div>
      {viewer.isPremium ? (
        <p className="intro">{t.account.premium} ✓</p>
      ) : viewer.reader ? (
        <p className="panel" style={{ margin: 0, color: 'var(--bone-2)' }}>{t.premium.soon}</p>
      ) : (
        <Link className="btn btn-ember" href={`/${locale}/register`}>{t.premium.signInFirst}</Link>
      )}
    </section>
  )
}
