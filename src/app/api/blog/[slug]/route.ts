/**
 * Blog Post Detail API Route
 * Fetches a single blog post by slug from Sanity
 */

import { getPostBySlug } from '@/lib/data';
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

        const post = await getPostBySlug(slug);

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Blog yazısı bulunamadı.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error('Blog post API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Blog yazısı alınırken bir hata oluştu.',
            },
            { status: 500 }
        );
    }
}
