'use client';

import { LanguageToggle } from '@/components/i18n';
import { SearchButton } from '@/components/search/SearchCommand';
import { siteConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navItems = [
        { label: t('home'), href: '/' },
        { label: t('blog'), href: '/blog' },
        { label: t('projects'), href: '/projects' },
        { label: t('about'), href: '/about' },
        { label: t('contact'), href: '/contact' },
    ];

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

    return (
        <header className={cn(
            "fixed top-0 z-50 w-full transition-all duration-300",
            scrolled ? "pt-2" : "pt-0"
        )}>
            <div className="container-custom">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                        "relative mx-auto flex h-14 items-center justify-between rounded-full px-6 transition-all duration-300",
                        scrolled
                            ? "glass-panel bg-[#030014]/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] max-w-5xl mt-2"
                            : "bg-transparent max-w-full mt-0"
                    )}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-xl font-bold text-white transition-colors"
                    >
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/10 ring-1 ring-primary-600/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                            <span className="font-mono text-lg text-primary-500">&gt;</span>
                        </div>
                        <span className="font-mono tracking-tight group-hover:text-primary-400">
                            {siteConfig.name}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary-400',
                                    pathname === item.href ? 'text-primary-400' : 'text-neutral-400'
                                )}
                            >
                                {item.label}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-white/10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-3 md:flex">
                        <div className="h-4 w-px bg-white/10" />
                        <SearchButton />
                        <LanguageToggle />
                        {/* <ThemeToggle /> - Theme is now forced dark/cyber */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="relative z-50 rounded-lg p-2 text-neutral-400 hover:bg-white/5 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">{mobileMenuOpen ? t('closeMenu') : t('openMenu')}</span>
                        <div className="flex flex-col gap-1.5">
                            <span className={cn("h-0.5 w-6 bg-current transition-all", mobileMenuOpen && "rotate-45 translate-y-2")} />
                            <span className={cn("h-0.5 w-6 bg-current transition-all", mobileMenuOpen && "opacity-0")} />
                            <span className={cn("h-0.5 w-6 bg-current transition-all", mobileMenuOpen && "-rotate-45 -translate-y-2")} />
                        </div>
                    </button>

                    {/* Mobile Menu Overlay */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute left-0 right-0 top-full mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#030014]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
                            >
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                                                pathname === item.href
                                                    ? 'bg-primary-500/10 text-primary-400'
                                                    : 'text-neutral-400 hover:bg-white/5'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                    <div className="mt-2 flex items-center gap-4 border-t border-white/10 px-4 pt-4">
                                        <SearchButton />
                                        <LanguageToggle />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </div>
        </header>
    );
}
