import type { AppLocale } from './locales'

const SITE = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

type MaybeReader = { name?: string | null; preferredLanguage?: string | null } | null | undefined

const pickLocale = (user: MaybeReader): AppLocale => {
  const l = user?.preferredLanguage
  return l === 'fr' || l === 'es' || l === 'bn' ? l : 'en'
}

const copy = {
  verify: {
    en: { subject: 'Confirm your Case97 account', hello: 'Hello', body: 'Confirm your email to open your Case97 account.', cta: 'Confirm my email' },
    fr: { subject: 'Confirmez votre compte Case97', hello: 'Bonjour', body: 'Confirmez votre e-mail pour ouvrir votre compte Case97.', cta: 'Confirmer mon e-mail' },
    es: { subject: 'Confirma tu cuenta de Case97', hello: 'Hola', body: 'Confirma tu correo para abrir tu cuenta de Case97.', cta: 'Confirmar mi correo' },
    bn: { subject: 'আপনার Case97 অ্যাকাউন্ট নিশ্চিত করুন', hello: 'নমস্কার', body: 'Case97 অ্যাকাউন্ট চালু করতে আপনার ইমেল নিশ্চিত করুন।', cta: 'ইমেল নিশ্চিত করুন' },
  },
  reset: {
    en: { subject: 'Reset your Case97 password', hello: 'Hello', body: 'Someone asked to reset your password. If it was you, choose a new one below. The link expires in 1 hour.', cta: 'Choose a new password' },
    fr: { subject: 'Réinitialisez votre mot de passe Case97', hello: 'Bonjour', body: 'Une réinitialisation du mot de passe a été demandée. Si c’était vous, choisissez-en un nouveau. Le lien expire dans 1 heure.', cta: 'Choisir un nouveau mot de passe' },
    es: { subject: 'Restablece tu contraseña de Case97', hello: 'Hola', body: 'Alguien pidió restablecer tu contraseña. Si fuiste tú, elige una nueva. El enlace caduca en 1 hora.', cta: 'Elegir una nueva contraseña' },
    bn: { subject: 'আপনার Case97 পাসওয়ার্ড রিসেট করুন', hello: 'নমস্কার', body: 'আপনার পাসওয়ার্ড রিসেটের অনুরোধ এসেছে। আপনি করে থাকলে নিচে নতুন পাসওয়ার্ড বেছে নিন। লিংকটি ১ ঘণ্টা কার্যকর থাকবে।', cta: 'নতুন পাসওয়ার্ড বেছে নিন' },
  },
}

const layout = (hello: string, name: string, body: string, cta: string, href: string) => `
<div style="background:#0e0d0c;padding:40px 16px;font-family:Georgia,serif">
  <div style="max-width:520px;margin:0 auto;background:#171513;border:1px solid #2a2622;padding:36px;color:#ede6da">
    <p style="font-family:monospace;letter-spacing:4px;color:#e8a15f;margin:0 0 24px">CASE97</p>
    <p style="font-size:18px;margin:0 0 12px">${hello} ${name},</p>
    <p style="font-size:16px;line-height:1.6;color:#c9c1b5;margin:0 0 28px">${body}</p>
    <a href="${href}" style="display:inline-block;background:#c8742e;color:#140f0a;padding:14px 22px;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold">${cta}</a>
    <p style="font-size:12px;color:#8a8276;margin:28px 0 0;font-family:Arial,sans-serif">${href}</p>
  </div>
</div>`

export const verifyEmail = (user: MaybeReader, token?: string) => {
  const l = pickLocale(user)
  const c = copy.verify[l]
  const href = `${SITE()}/${l}/verify?token=${token ?? ''}`
  return { subject: c.subject, html: layout(c.hello, user?.name ?? '', c.body, c.cta, href) }
}

export const resetPasswordEmail = (user: MaybeReader, token?: string) => {
  const l = pickLocale(user)
  const c = copy.reset[l]
  const href = `${SITE()}/${l}/reset-password?token=${token ?? ''}`
  return { subject: c.subject, html: layout(c.hello, user?.name ?? '', c.body, c.cta, href) }
}
