export const locales = ['en', 'fr', 'es', 'bn'] as const
export type AppLocale = (typeof locales)[number]
export const defaultLocale: AppLocale = 'en'

export const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  bn: 'বাংলা',
}
