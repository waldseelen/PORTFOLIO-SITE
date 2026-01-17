/**
 * Liveness Check API Route
 * Simple check to verify the application is running
 */

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
    });
}
