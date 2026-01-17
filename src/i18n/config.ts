// i18n configuration
export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'tr';

// Locale display names
export const localeNames: Record<Locale, string> = {
    tr: 'Türkçe',
    en: 'English',
};

// Locale flags (emoji)
export const localeFlags: Record<Locale, string> = {
    tr: '🇹🇷',
    en: '🇬🇧',
};

// Locale metadata for HTML
export const localeMetadata: Record<Locale, { lang: string; dir: 'ltr' | 'rtl' }> = {
    tr: { lang: 'tr', dir: 'ltr' },
    en: { lang: 'en', dir: 'ltr' },
};

// Timezone mapping for GeoIP
export const timezoneToLocale: Record<string, Locale> = {
    'Europe/Istanbul': 'tr',
    'Asia/Istanbul': 'tr',
    // Default to English for other timezones
};

// Country code mapping for GeoIP
export const countryToLocale: Record<string, Locale> = {
    TR: 'tr',
    CY: 'tr', // Cyprus (Northern)
    // Default to English for other countries
};
