'use client';

import { navItems, siteConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 glass dark:border-neutral-800">
            <div className="container-custom">
                <nav className="flex h-16 items-center justify-between" aria-label="Ana navigasyon">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold text-neutral-900 transition-colors hover:text-primary-600 dark:text-neutral-50 dark:hover:text-primary-400"
                    >
                        <span className="sr-only">{siteConfig.name} Ana Sayfa</span>
                        <svg
                            className="h-8 w-8 text-primary-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                        </svg>
                        <span>{siteConfig.name}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'nav-link',
                                    pathname === item.href && 'active'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-4 md:flex">
                        {/* Theme Toggle (placeholder) */}
                        <button
                            type="button"
                            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                            aria-label="Tema değiştir"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 md:hidden dark:text-neutral-400 dark:hover:bg-neutral-800"
                        onClick={toggleMobileMenu}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    className={cn(
                        'overflow-hidden border-t border-neutral-200 transition-all duration-300 md:hidden dark:border-neutral-800',
                        mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
                    )}
                >
                    <div className="flex flex-col gap-1 pt-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                    pathname === item.href
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
