import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/AuthForms'
import { getDict, toLocale } from '@/lib/i18n'
import { getViewer } from '@/lib/payload'

export const metadata = { title: 'Sign in' }

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> }) {
  const locale = toLocale((await params).locale)
  if ((await getViewer()).reader) redirect(`/${locale}/account`)
  const { next } = await searchParams
  return <LoginForm locale={locale} t={getDict(locale).auth} next={next} />
}
