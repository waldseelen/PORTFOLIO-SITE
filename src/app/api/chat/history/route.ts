/**
 * Chat History API Route
 * Get chat history for a session
 * TODO: Implement persistent storage (Sanity/Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    // Validate session ID
    if (!sessionId) {
        return NextResponse.json(
            {
                success: false,
                error: 'Session ID is required',
            },
            { status: 400 }
        );
    }

    // TODO: Fetch actual chat history from storage
    // For now, return empty history
    return NextResponse.json({
        success: true,
        data: {
            session_id: sessionId,
            messages: [],
            // When implemented, structure should be:
            // messages: [
            //   {
            //     id: 'msg_1',
            //     role: 'user',
            //     content: 'Hello',
            //     timestamp: '2024-01-17T10:00:00Z'
            //   },
            //   {
            //     id: 'msg_2',
            //     role: 'assistant',
            //     content: 'Hi there!',
            //     timestamp: '2024-01-17T10:00:01Z'
            //   }
            // ]
        },
    });
}
