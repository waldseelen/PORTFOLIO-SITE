/**
 * Readiness Check API Route
 * Checks if the application is ready to serve traffic
 */

import { sanityFetch } from '@/sanity/client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check if Sanity is accessible
        await sanityFetch<number>({
            query: `count(*[_type == "post"])`,
        });

        return NextResponse.json({
            status: 'ready',
            timestamp: new Date().toISOString(),
            checks: {
                sanity: 'ready',
                nextjs: 'ready',
            },
        });
    } catch (error) {
        console.error('Readiness check failed:', error);
        return NextResponse.json(
            {
                status: 'not_ready',
                timestamp: new Date().toISOString(),
                error: 'One or more services are not ready',
            },
            { status: 503 }
        );
    }
}
