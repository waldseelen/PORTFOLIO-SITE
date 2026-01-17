/**
 * Health Check API Route
 * Returns the health status of the application
 */

import { sanityFetch } from '@/sanity/client';
import { NextResponse } from 'next/server';

async function checkSanityConnection(): Promise<{
    status: 'healthy' | 'unhealthy';
    responseTime: number;
}> {
    const start = Date.now();
    try {
        await sanityFetch<number>({
            query: `count(*[_type == "post"])`,
        });
        return {
            status: 'healthy',
            responseTime: Date.now() - start,
        };
    } catch {
        return {
            status: 'unhealthy',
            responseTime: Date.now() - start,
        };
    }
}

export async function GET() {
    try {
        const startTime = Date.now();

        // Check Sanity connection
        const sanityHealth = await checkSanityConnection();

        // Calculate overall health
        const isHealthy = sanityHealth.status === 'healthy';

        const healthData = {
            status: isHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime?.() || 0,
            environment: process.env.NODE_ENV || 'development',
            services: {
                sanity: sanityHealth,
            },
            responseTime: Date.now() - startTime,
        };

        return NextResponse.json(healthData, {
            status: isHealthy ? 200 : 503,
        });
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            },
            { status: 503 }
        );
    }
}
