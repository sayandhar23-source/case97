import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Story } from '@/payload-types'
import { SignOutButton } from '@/components/AuthForms'
import { formatDate, getDict, toLocale } from '@/lib/i18n'
import { getPayloadClient, getViewer, imageUrl } from '@/lib/payload'

export const metadata = { title: 'Your account' }

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale)
  const t = getDict(locale)
  const viewer = await getViewer()
  if (viewer.isAdmin) redirect('/admin')
  if (!viewer.reader) redirect(`/${locale}/login?next=/${locale}/account`)

  const payload = await getPayloadClient()
  const reader = await payload.findByID({ collection: 'readers', id: viewer.reader.id, depth: 1, locale, overrideAccess: true })
  const wishlist = (reader.wishlist ?? []).filter((s): s is Story => typeof s === 'object' && !!s)
  const sub = reader.subscription
  const end = sub?.currentPeriodEnd

  return (
    <section className="wrap page">
      <h1>{t.account.title}</h1>
      <p className="intro">{reader.name} · {reader.email}</p>
      <div className="two-col">
        <div className="panel">
          <h2 style={{ font: '600 28px var(--f-display)', margin: '0 0 18px' }}>{t.account.wishlist}</h2>
          {wishlist.length ? (
            <ul className="wish-list">
              {wishlist.map((s) => (
                <li key={s.id}>
                  {imageUrl(s.coverImage, 'thumbnail') && <img src={imageUrl(s.coverImage, 'thumbnail')!} alt="" />}
                  <Link href={`/${locale}/stories/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--ash)', margin: 0 }}>{t.account.emptyWishlist}</p>
          )}
        </div>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ font: '600 28px var(--f-display)', margin: 0 }}>{t.account.plan}</h2>
          <p style={{ margin: 0, fontSize: 18 }}>{viewer.isPremium ? t.account.premium : t.account.free}</p>
          {viewer.isPremium && end && (
            <p style={{ margin: 0, color: 'var(--ash)' }}>
              {sub?.status === 'active' ? t.account.renews : t.account.endsOn} {formatDate(end, locale)}
            </p>
          )}
          {!viewer.isPremium && <Link className="btn btn-ember" href={`/${locale}/premium`}>{t.account.upgrade}</Link>}
          <SignOutButton locale={locale} label={t.account.signOut} />
        </div>
      </div>
    </section>
  )
}
