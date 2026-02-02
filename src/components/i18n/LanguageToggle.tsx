'use client';

import { localeFlags, localeNames, locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

interface LanguageToggleProps {
    className?: string;
    showFlag?: boolean;
    showName?: boolean;
    variant?: 'button' | 'dropdown' | 'minimal';
}

export function LanguageToggle({
    className,
    showFlag = true,
    showName = false,
    variant = 'button',
}: LanguageToggleProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [currentLocale, setCurrentLocale] = useState<Locale>('tr');
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Get saved language preference OR detect from geoIP
    useEffect(() => {
        const getSavedLocale = async (): Promise<Locale> => {
            if (typeof window === 'undefined') return 'tr';

            // 1. localStorage'dan oku (birincil tercih - kullanıcı ayarı)
            const savedLocale = localStorage.getItem('preferredLocale') as Locale | null;
            if (savedLocale && locales.includes(savedLocale)) {
                return savedLocale;
            }

            // 2. Cookie'den oku
            const cookieLocale = document.cookie
                .split('; ')
                .find((row) => row.startsWith('NEXT_LOCALE='))
                ?.split('=')[1] as Locale | undefined;

            if (cookieLocale && locales.includes(cookieLocale)) {
                return cookieLocale;
            }

            // 3. GeoIP'den otomatik detect (ilk ziyaret - birincil senaryo)
            try {
                const response = await fetch('/api/geo-locale');
                const data = await response.json();
                if (data.locale && locales.includes(data.locale)) {
                    return data.locale;
                }
            } catch (error) {
                console.error('GeoIP detection failed:', error);
            }

            return 'tr'; // Default fallback
        };

        getSavedLocale().then((locale) => {
            setCurrentLocale(locale);
            setMounted(true);
        });
    }, []);

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === currentLocale) return;

        // 1. Cookie'ye kaydet (Server tarafında okumak için birincil yöntem)
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

        // 2. localStorage'a kaydet (Client tarafında yedek)
        localStorage.setItem('preferredLocale', newLocale);

        // 3. State'i güncelle
        setCurrentLocale(newLocale);
        setIsOpen(false);

        // 4. Sayfayı tam yenile (Hard reload)
        // Next.js router cache bazen cookie değişimini hemen algılamıyor, bu yüzden tam yenileme yapıyoruz.
        window.location.reload();
    };

    // Hydration mismatch'i önle
    if (!mounted) {
        return null;
    }

    const otherLocale = currentLocale === 'tr' ? 'en' : 'tr';

    if (variant === 'minimal') {
        return (
            <button
                onClick={() => switchLocale(otherLocale)}
                disabled={isPending}
                className={cn(
                    'text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors',
                    isPending && 'opacity-50 cursor-not-allowed',
                    className
                )}
                aria-label={`Switch to ${localeNames[otherLocale]}`}
            >
                {currentLocale.toUpperCase()} | {otherLocale.toUpperCase()}
            </button>
        );
    }

    if (variant === 'button') {
        return (
            <button
                onClick={() => switchLocale(otherLocale)}
                disabled={isPending}
                className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium',
                    'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                    'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isPending && 'opacity-50 cursor-not-allowed',
                    className
                )}
                aria-label={`Switch to ${localeNames[otherLocale]}`}
            >
                {showFlag && <span className="text-base">{localeFlags[otherLocale]}</span>}
                {showName ? (
                    <span>{localeNames[otherLocale]}</span>
                ) : (
                    <span className="uppercase">{otherLocale}</span>
                )}
            </button>
        );
    }

    // Dropdown variant
    return (
        <div className={cn('relative', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium',
                    'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                    'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isPending && 'opacity-50 cursor-not-allowed'
                )}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
            >
                {showFlag && <span className="text-base">{localeFlags[currentLocale]}</span>}
                <span className="uppercase">{currentLocale}</span>
                <svg
                    className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Dropdown menu */}
                    <div
                        className={cn(
                            'absolute right-0 top-full z-50 mt-1 min-w-[120px] rounded-lg border',
                            'bg-white dark:bg-neutral-900',
                            'border-neutral-200 dark:border-neutral-800',
                            'shadow-lg',
                            'animate-in fade-in-0 zoom-in-95 duration-200'
                        )}
                        role="listbox"
                    >
                        {locales.map((locale) => (
                            <button
                                key={locale}
                                onClick={() => switchLocale(locale)}
                                className={cn(
                                    'flex w-full items-center gap-2 px-3 py-2 text-sm',
                                    'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                    'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
                                    'first:rounded-t-lg last:rounded-b-lg',
                                    currentLocale === locale && 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                )}
                                role="option"
                                aria-selected={currentLocale === locale}
                            >
                                <span className="text-base">{localeFlags[locale]}</span>
                                <span>{localeNames[locale]}</span>
                                {currentLocale === locale && (
                                    <svg
                                        className="ml-auto h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
