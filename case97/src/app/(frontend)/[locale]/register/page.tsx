import { redirect } from 'next/navigation'
import { RegisterForm } from '@/components/AuthForms'
import { getDict, toLocale } from '@/lib/i18n'
import { getViewer } from '@/lib/payload'

export const metadata = { title: 'Create your account' }

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = toLocale((await params).locale)
  if ((await getViewer()).reader) redirect(`/${locale}/account`)
  return <RegisterForm locale={locale} t={getDict(locale).auth} />
}
