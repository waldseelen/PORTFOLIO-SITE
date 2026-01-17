/**
 * Analytics API Route
 * Collects and retrieves performance/analytics metrics
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (use database in production)
const metricsStore: Array<{
    timestamp: string;
    type: string;
    metrics: Record<string, number | string>;
    userAgent?: string;
    url?: string;
}> = [];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, metrics, url } = body;

        // Validate required fields
        if (!type || !metrics) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Type ve metrics alanları gerekli.',
                },
                { status: 400 }
            );
        }

        // Store metrics
        const metricEntry = {
            timestamp: new Date().toISOString(),
            type,
            metrics,
            userAgent: request.headers.get('user-agent') || undefined,
            url,
        };

        metricsStore.push(metricEntry);

        // Keep only last 1000 entries (memory limit)
        if (metricsStore.length > 1000) {
            metricsStore.shift();
        }

        // TODO: In production, save to database or analytics service
        // Example: Vercel Analytics, Google Analytics 4, PostHog, etc.

        return NextResponse.json({
            success: true,
            message: 'Metrikler kaydedildi.',
        });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Metrikler kaydedilemedi.',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '100', 10);

        let filteredMetrics = metricsStore;

        if (type) {
            filteredMetrics = metricsStore.filter((m) => m.type === type);
        }

        const latestMetrics = filteredMetrics.slice(-limit);

        // Calculate summary statistics
        const summary = {
            totalEntries: latestMetrics.length,
            types: [...new Set(latestMetrics.map((m) => m.type))],
            latestTimestamp: latestMetrics[latestMetrics.length - 1]?.timestamp || null,
            oldestTimestamp: latestMetrics[0]?.timestamp || null,
        };

        return NextResponse.json({
            success: true,
            data: latestMetrics,
            summary,
        });
    } catch (error) {
        console.error('Analytics GET error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Metrikler alınamadı.',
            },
            { status: 500 }
        );
    }
}
