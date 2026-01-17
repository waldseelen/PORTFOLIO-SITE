import { GoogleAnalytics, VercelAnalytics } from '@/components/analytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { siteConfig } from '@/lib/constants';
import { Providers } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Font configurations
const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jetbrains-mono',
});

// Metadata configuration
export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['portfolio', 'web development', 'full-stack', 'next.js', 'react', 'typescript'],
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
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
};

// Viewport configuration
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <body className="flex min-h-screen flex-col font-sans antialiased">
                <Providers>
                    {/* Analytics */}
                    <GoogleAnalytics />
                    <VercelAnalytics />

                    {/* Skip to main content link for accessibility */}
                    <a href="#main-content" className="skip-link">
                        Ana içeriğe geç
                    </a>

                    {/* Header */}
                    <Header />

                    {/* Main content */}
                    <main id="main-content" className="flex-1">
                        {children}
                    </main>

                    {/* Footer */}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
