import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import type { AppLocale } from '@/lib/locales'
import type { Dict } from '@/lib/i18n'

const platformNames: Record<string, string> = {
  instagram: 'Instagram', facebook: 'Facebook', x: 'X', youtube: 'YouTube', tiktok: 'TikTok', pinterest: 'Pinterest', threads: 'Threads',
}

export function Footer({ locale, t, settings }: { locale: AppLocale; t: Dict; settings: SiteSetting }) {
  const socials = settings.socialLinks ?? []
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link href={`/${locale}`} className="logo"><span className="logo-mark" aria-hidden="true">97</span>CASE97</Link>
          <p>{settings.tagline || t.footer.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Site">
          <Link href={`/${locale}/stories`}>{t.common.allStories}</Link>
          <Link href={`/${locale}/premium`}>Premium</Link>
          <a href="#">{t.footer.privacy}</a>
          <a href="#">{t.footer.terms}</a>
        </nav>
        {socials.length > 0 && (
          <nav className="footer-links" aria-label={t.footer.follow}>
            {socials.map((s) => (
              <a key={s.id ?? s.url} href={s.url} target="_blank" rel="noopener noreferrer">{platformNames[s.platform] ?? s.platform}</a>
            ))}
          </nav>
        )}
        {settings.discordInvite && (
          <div>
            <a className="btn btn-solid" href={settings.discordInvite} target="_blank" rel="noopener noreferrer">{t.footer.discord}</a>
          </div>
        )}
      </div>
      <div className="wrap footer-base">© {new Date().getFullYear()} Case97</div>
    </footer>
  )
}
