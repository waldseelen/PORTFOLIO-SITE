/**
 * Analytics Dashboard API Route
 * Returns aggregated analytics data for dashboard
 */

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In production, fetch from database or analytics service
        // For now, return mock dashboard data

        const dashboardData = {
            overview: {
                totalPageViews: 0,
                uniqueVisitors: 0,
                avgSessionDuration: '0:00',
                bounceRate: '0%',
            },
            performance: {
                avgLoadTime: '0ms',
                coreWebVitals: {
                    LCP: { value: 0, rating: 'good' },
                    FID: { value: 0, rating: 'good' },
                    CLS: { value: 0, rating: 'good' },
                    TTFB: { value: 0, rating: 'good' },
                },
            },
            topPages: [],
            referrers: [],
            devices: {
                desktop: 0,
                mobile: 0,
                tablet: 0,
            },
            browsers: [],
            countries: [],
        };

        return NextResponse.json({
            success: true,
            data: dashboardData,
            message: 'Analytics dashboard data. Connect to analytics service for real data.',
        });
    } catch (error) {
        console.error('Analytics dashboard API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Dashboard verileri alınamadı.',
            },
            { status: 500 }
        );
    }
}
