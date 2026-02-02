import { siteConfig } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function Footer() {
    const currentYear = new Date().getFullYear();
    const tNav = await getTranslations('navigation');
    const tContact = await getTranslations('contact');
    const tFooter = await getTranslations('footer');

    const navItems = [
        { label: tNav('home'), href: '/' },
        { label: tNav('about'), href: '/about' },
        { label: tNav('projects'), href: '/projects' },
        { label: tNav('blog'), href: '/blog' },
        { label: tNav('contact'), href: '/contact' },
    ];

    return (
        <footer className="relative mt-20 overflow-hidden border-t border-white/5 bg-[#030014]">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent blur-sm" />

            <div className="container-custom py-12 md:py-16">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xl font-bold text-white"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/10 ring-1 ring-primary-600/50">
                                <span className="font-mono text-lg text-primary-500">&gt;</span>
                            </div>
                            <span className="font-mono tracking-tight">{siteConfig.name}</span>
                        </Link>
                        <p className="mt-6 max-w-md text-neutral-400 leading-relaxed">
                            {siteConfig.description}
                        </p>

                        {/* Social Links */}
                        <div className="mt-8 flex gap-4">
                            <a
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group rounded-lg bg-white/5 p-2 transition-all hover:bg-primary-600/20 hover:text-primary-400 text-neutral-400"
                                aria-label="GitHub"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href={siteConfig.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group rounded-lg bg-white/5 p-2 transition-all hover:bg-secondary-600/20 hover:text-secondary-400 text-neutral-400"
                                aria-label="LinkedIn"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            {tFooter('navigation')}
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-neutral-400 transition-colors hover:text-primary-400 hover:translate-x-1 inline-block"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            {tContact('title')}
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <a
                                    href={`mailto:${siteConfig.author.email}`}
                                    className="text-sm text-neutral-400 transition-colors hover:text-primary-400"
                                >
                                    {siteConfig.author.email}
                                </a>
                            </li>
                            <li className="text-sm text-neutral-500">
                                {tContact('info.location')}: Gaziantep, Türkiye
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-white/5 pt-8">
                    <p className="text-center text-xs text-neutral-500 font-mono">
                        &copy; {currentYear} {siteConfig.author.name}. System Status: <span className="text-accent-500">Online</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
