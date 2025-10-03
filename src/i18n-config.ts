export const i18n = {
  locales: ['en', 'ar'],
  defaultLocale: 'en'
} as const;

export type Locale = typeof i18n.locales[number];
