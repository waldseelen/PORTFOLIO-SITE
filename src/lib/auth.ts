/**
 * NextAuth.js Configuration
 * Authentication options for GitHub and Google providers
 */

import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    provider: account.provider,
                    userId: user.id,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.userId as string;
                (session as { accessToken?: string }).accessToken = token.accessToken as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
