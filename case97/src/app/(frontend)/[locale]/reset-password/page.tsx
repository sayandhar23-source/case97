import { ResetForm } from '@/components/AuthForms'
import { getDict, toLocale } from '@/lib/i18n'

export const metadata = { title: 'Choose a new password' }

export default async function ResetPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ token?: string }> }) {
  const locale = toLocale((await params).locale)
  const { token } = await searchParams
  return <ResetForm locale={locale} t={getDict(locale).auth} token={token ?? ''} />
}
