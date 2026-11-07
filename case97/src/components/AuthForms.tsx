'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { localeLabels, locales, type AppLocale } from '@/lib/locales'
import type { Dict } from '@/lib/i18n'
import { AuthShell } from './Mirror'

type A = Dict['auth']

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  let json: { errors?: { message?: string; data?: { errors?: { path?: string }[] } }[]; message?: string } = {}
  try { json = await res.json() } catch {}
  return { ok: res.ok, status: res.status, json }
}

const errorText = (json: Awaited<ReturnType<typeof post>>['json']) => (json.errors?.[0]?.message ?? json.message ?? '').toLowerCase()

function PasswordField({ id, label, t, autoComplete }: { id: string; label: string; t: A; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input id={id} name="password" className="input" type={show ? 'text' : 'password'} required minLength={8} autoComplete={autoComplete} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-controls={id}>{show ? t.hide : t.show}</button>
      </div>
    </div>
  )
}

export function RegisterForm({ locale, t }: { locale: AppLocale; t: A }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const password = String(f.get('password') ?? '')
    if (password.length < 8) return setError(t.errPassword)
    setState('busy')
    setError(null)
    const res = await post('/api/readers', {
      name: String(f.get('name') ?? '').trim(),
      email: String(f.get('email') ?? '').trim(),
      password,
      preferredLanguage: String(f.get('lang') ?? locale),
    })
    if (res.ok) return setState('done')
    setState('idle')
    const field = res.json.errors?.[0]?.data?.errors?.[0]?.path
    const msg = errorText(res.json)
    setError(field === 'email' || msg.includes('email') || msg.includes('already') ? t.errEmailTaken : t.errGeneric)
  }

  if (state === 'done') {
    return (
      <AuthShell>
        <div role="status">
          <h1>{t.checkEmailTitle}</h1>
          <p className="intro">{t.checkEmailBody}</p>
        </div>
        <Link href={`/${locale}/login`} className="btn-mirror" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{t.login}</Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell alert={!!error}>
      <div>
        <h1>{t.registerTitle}</h1>
        <p className="intro">{t.registerIntro}</p>
      </div>
      <form onSubmit={onSubmit} noValidate={false}>
        <label className="field">{t.name}<input className="input" name="name" required autoComplete="name" /></label>
        <label className="field">{t.email}<input className="input" name="email" type="email" required autoComplete="email" /></label>
        <PasswordField id="reg-pw" label={t.password} t={t} autoComplete="new-password" />
        <label className="field">{t.language}
          <select className="input" name="lang" defaultValue={locale}>
            {locales.map((l) => <option key={l} value={l} lang={l}>{localeLabels[l]}</option>)}
          </select>
        </label>
        <label className="check"><input type="checkbox" required /> {t.terms}</label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn-mirror" type="submit" disabled={state === 'busy'}>{t.register}</button>
        <p className="form-note">{t.haveAccount} <Link href={`/${locale}/login`}>{t.login}</Link></p>
      </form>
    </AuthShell>
  )
}

export function LoginForm({ locale, t, next }: { locale: AppLocale; t: A; next?: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)
    const res = await post('/api/readers/login', { email: String(f.get('email') ?? '').trim(), password: String(f.get('password') ?? '') })
    if (res.ok) {
      const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : `/${locale}/account`
      router.push(safeNext)
      router.refresh()
      return
    }
    setBusy(false)
    const msg = errorText(res.json)
    setError(msg.includes('verif') ? t.errUnverified : msg.includes('lock') ? t.errLocked : res.status === 401 ? t.errLogin : t.errGeneric)
  }

  return (
    <AuthShell alert={!!error}>
      <div>
        <h1>{t.loginTitle}</h1>
        <p className="intro">{t.loginIntro}</p>
      </div>
      <form onSubmit={onSubmit}>
        <label className="field">{t.email}<input className="input" name="email" type="email" required autoComplete="email" /></label>
        <PasswordField id="login-pw" label={t.password} t={t} autoComplete="current-password" />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn-mirror" type="submit" disabled={busy}>{t.login}</button>
        <p className="form-note"><Link href={`/${locale}/forgot-password`}>{t.forgot}</Link></p>
        <p className="form-note">{t.noAccount} <Link href={`/${locale}/register`}>{t.createOne}</Link></p>
      </form>
    </AuthShell>
  )
}

export function ForgotForm({ locale, t }: { locale: AppLocale; t: A }) {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    await post('/api/readers/forgot-password', { email: String(new FormData(e.currentTarget).get('email') ?? '').trim() })
    setSent(true) // same answer whether or not the email exists
  }
  return (
    <AuthShell>
      <div>
        <h1>{t.forgotTitle}</h1>
        <p className="intro">{sent ? t.linkSent : t.forgotIntro}</p>
      </div>
      {!sent && (
        <form onSubmit={onSubmit}>
          <label className="field">{t.email}<input className="input" name="email" type="email" required autoComplete="email" /></label>
          <button className="btn-mirror" type="submit" disabled={busy}>{t.sendLink}</button>
        </form>
      )}
      <p className="form-note"><Link href={`/${locale}/login`}>{t.login}</Link></p>
    </AuthShell>
  )
}

export function ResetForm({ locale, t, token }: { locale: AppLocale; t: A; token: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const password = String(new FormData(e.currentTarget).get('password') ?? '')
    if (password.length < 8) return setError(t.errPassword)
    setBusy(true)
    const res = await post('/api/readers/reset-password', { token, password })
    if (res.ok) {
      router.push(`/${locale}/account`)
      router.refresh()
      return
    }
    setBusy(false)
    setError(t.verifyFailed)
  }
  return (
    <AuthShell alert={!!error}>
      <h1>{t.resetTitle}</h1>
      <form onSubmit={onSubmit}>
        <PasswordField id="reset-pw" label={t.newPassword} t={t} autoComplete="new-password" />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn-mirror" type="submit" disabled={busy || !token}>{t.savePassword}</button>
      </form>
    </AuthShell>
  )
}

export function VerifyEmail({ locale, t, token }: { locale: AppLocale; t: A; token: string }) {
  const [state, setState] = useState<'busy' | 'ok' | 'fail'>('busy')
  useEffect(() => {
    if (!token) return setState('fail')
    post(`/api/readers/verify/${encodeURIComponent(token)}`).then((r) => setState(r.ok ? 'ok' : 'fail'))
  }, [token])
  return (
    <AuthShell alert={state === 'fail'}>
      <h1>{t.verifyTitle}</h1>
      <p className="intro" role="status">{state === 'busy' ? t.verifying : state === 'ok' ? t.verified : t.verifyFailed}</p>
      {state !== 'busy' && <Link href={`/${locale}/login`} className="btn-mirror" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{t.login}</Link>}
    </AuthShell>
  )
}

export function SignOutButton({ locale, label }: { locale: AppLocale; label: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={async () => {
        await post('/api/readers/logout')
        router.push(`/${locale}`)
        router.refresh()
      }}
    >
      {label}
    </button>
  )
}
