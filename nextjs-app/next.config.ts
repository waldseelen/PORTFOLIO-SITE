import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const withSerwist = withSerwistInit({
    swSrc: 'src/sw.ts',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
    // Image optimization for Sanity
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/images/**',
            },
        ],
    },

    // Turbopack for faster dev builds
    turbopack: {},

    // Headers for security and caching
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                ],
            },
        ];
    },

    // Rewrites for Django API proxy (development)
    async rewrites() {
        const djangoApiUrl = process.env.DJANGO_API_URL || 'http://localhost:8000';
        return [
            {
                source: '/api/django/:path*',
                destination: `${djangoApiUrl}/api/:path*`,
            },
        ];
    },
};

export default withSerwist(nextConfig);
