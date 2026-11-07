import { ForgotForm } from '@/components/AuthForms'
import { getDict, toLocale } from '@/lib/i18n'

export const metadata = { title: 'Reset your password' }

export default async function ForgotPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale)
  return <ForgotForm locale={locale} t={getDict(locale).auth} />
}
