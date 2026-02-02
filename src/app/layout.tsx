import { GoogleAnalytics, VercelAnalytics } from '@/components/analytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PWAInstallPrompt, PWAUpdatePrompt } from '@/components/pwa';
import { SearchCommand } from '@/components/search/SearchCommand';
import { siteConfig } from '@/lib/constants';
import { Providers } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
// import { Inter, JetBrains_Mono } from 'next/font/google';

// Font configurations - temporarily using system fonts due to Google Fonts connection issues
// const inter = Inter({
//     subsets: ['latin', 'latin-ext'],
//     display: 'swap',
//     variable: '--font-inter',
//     fallback: ['system-ui', 'arial'],
// });

// const jetbrainsMono = JetBrains_Mono({
//     subsets: ['latin'],
//     display: 'swap',
//     variable: '--font-jetbrains-mono',
//     fallback: ['monospace'],
// });

// Metadata configuration
export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['yapay zeka', 'siber güvenlik', 'AI', 'LLM', 'RAG', 'cybersecurity', 'next.js', 'react', 'python', 'prompt engineering'],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'tr_TR',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        creator: siteConfig.author.twitter,
        images: ['/og-image.png'],
    },
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23030014%22/><path d=%22M30 70 L60 50 L30 30%22 fill=%22none%22 stroke=%22%2300F0FF%22 stroke-width=%228%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/><path d=%22M65 70 L90 70%22 fill=%22none%22 stroke=%22%2300F0FF%22 stroke-width=%228%22 stroke-linecap=%22round%22/></svg>', sizes: 'any', type: 'image/svg+xml' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
};

// Viewport configuration
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className="font-sans" suppressHydrationWarning>
            <body className="flex min-h-screen flex-col font-sans antialiased">{/*className={`${inter.variable} ${jetbrainsMono.variable}`}*/}
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        {/* Analytics */}
                        <GoogleAnalytics />
                        <VercelAnalytics />{' '}

                        {/* Skip to main content link for accessibility */}
                        <a href="#main-content" className="skip-link">
                            Ana içeriğe geç
                        </a>

                        {/* Header */}
                        <Header />

                        <SearchCommand />

                        {/* Main content */}
                        <main id="main-content" className="flex-1">
                            {children}
                        </main>

                        {/* Footer */}
                        <Footer />

                        {/* PWA Prompts */}
                        <PWAInstallPrompt />
                        <PWAUpdatePrompt />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
