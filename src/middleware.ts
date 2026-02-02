import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, locales } from './i18n/config';

// Middleware to ensure NEXT_LOCALE cookie exists
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignore API, static files, etc.
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // images, etc.
    ) {
        return;
    }

    // Check if cookie exists
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

    // If cookie is missing or invalid, set default or detect from header
    if (!cookieLocale || !locales.includes(cookieLocale as any)) {
        // Simple detection: check accept-language
        const acceptLanguage = request.headers.get('accept-language');
        let detectedLocale = defaultLocale;

        if (acceptLanguage) {
            if (acceptLanguage.includes('en')) {
                detectedLocale = 'en';
            } else if (acceptLanguage.includes('tr')) {
                detectedLocale = 'tr';
            }
        }

        const response = NextResponse.next();
        response.cookies.set('NEXT_LOCALE', detectedLocale, {
            path: '/',
            maxAge: 31536000,
            sameSite: 'lax',
        });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
