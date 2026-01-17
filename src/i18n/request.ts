import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { countryToLocale, defaultLocale, locales, type Locale } from './config';

// Get locale from various sources
async function getLocaleFromRequest(): Promise<Locale> {
    // 1. Check cookie for saved preference
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
        return localeCookie.value as Locale;
    }

    // 2. Check Vercel's geo header (GeoIP)
    const headerStore = await headers();
    const country = headerStore.get('x-vercel-ip-country');
    if (country && countryToLocale[country]) {
        return countryToLocale[country];
    }

    // 3. Check Accept-Language header
    const acceptLanguage = headerStore.get('accept-language');
    if (acceptLanguage) {
        const preferredLocale = parseAcceptLanguage(acceptLanguage);
        if (preferredLocale) {
            return preferredLocale;
        }
    }

    // 4. Default locale
    return defaultLocale;
}

// Parse Accept-Language header
function parseAcceptLanguage(acceptLanguage: string): Locale | null {
    const languages = acceptLanguage
        .split(',')
        .map((lang) => {
            const [locale, quality = 'q=1'] = lang.trim().split(';');
            return {
                locale: locale.split('-')[0].toLowerCase(),
                quality: parseFloat(quality.replace('q=', '')),
            };
        })
        .sort((a, b) => b.quality - a.quality);

    for (const { locale } of languages) {
        if (locales.includes(locale as Locale)) {
            return locale as Locale;
        }
    }

    return null;
}

export default getRequestConfig(async () => {
    const locale = await getLocaleFromRequest();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});
