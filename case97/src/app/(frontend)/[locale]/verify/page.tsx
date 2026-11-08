import { VerifyEmail } from '@/components/AuthForms'
import { getDict, toLocale } from '@/lib/i18n'

export const metadata = { title: 'Confirm your email' }

export default async function VerifyPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const locale = toLocale((await params).locale)
  const { token } = await searchParams
  return <VerifyEmail locale={locale} t={getDict(locale).auth} token={token ?? ''} />
}
