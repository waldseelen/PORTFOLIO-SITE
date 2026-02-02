import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

// Validate projectId (only a-z, 0-9, and dashes)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isValidProjectId = projectId && /^[a-z0-9-]+$/.test(projectId);

// Sanity client with write access
const client = isValidProjectId
    ? createClient({
        projectId,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2026-01-18',
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
    })
    : null;

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * PATCH /api/comments/moderate/[id]
 * Moderate a comment (approve, reject, mark as spam)
 * Protected endpoint - requires authentication
 */
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Verify authentication (simple API key check)
        const authHeader = request.headers.get('authorization');
        const apiKey = process.env.MODERATION_API_KEY;

        if (apiKey && authHeader !== `Bearer ${apiKey}`) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { status, moderatedBy } = await request.json();

        if (!status || !['approved', 'rejected', 'spam', 'pending'].includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Use: approved, rejected, spam, or pending' },
                { status: 400 }
            );
        }

        if (!client) {
            return NextResponse.json(
                { message: 'Sanity client not configured' },
                { status: 503 }
            );
        }

        // Update comment status
        const result = await client
            .patch(id)
            .set({
                status,
                moderatedAt: new Date().toISOString(),
                moderatedBy: moderatedBy || 'admin',
            })
            .commit();

        return NextResponse.json({
            success: true,
            message: `Comment ${status}`,
            comment: result,
        });
    } catch (error) {
        console.error('Moderation error:', error);
        return NextResponse.json(
            { message: 'Failed to moderate comment' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/comments/moderate/[id]
 * Delete a comment permanently
 * Protected endpoint - requires authentication
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Verify authentication
        const authHeader = request.headers.get('authorization');
        const apiKey = process.env.MODERATION_API_KEY;

        if (apiKey && authHeader !== `Bearer ${apiKey}`) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!client) {
            return NextResponse.json(
                { message: 'Sanity client not configured' },
                { status: 503 }
            );
        }

        // Delete comment and its replies
        await client.delete({
            query: `*[_type == "comment" && (_id == $id || parentComment._ref == $id)]`,
            params: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Comment deleted',
        });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { message: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
