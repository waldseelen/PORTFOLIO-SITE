/**
 * Project Detail API Route
 * Fetches a single project by slug from Sanity
 */

import { getProjectBySlug } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Slug parametresi gerekli.',
                },
                { status: 400 }
            );
        }

        const project = await getProjectBySlug(slug);

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Proje bulunamadı.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error('Project API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Proje alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
