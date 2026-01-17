/**
 * Chat API Route
 * Simple chat endpoint with placeholder AI responses
 * TODO: Integrate with OpenAI or other AI service
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
    message: string;
    session_id?: string;
}

interface PlaceholderResponses {
    [key: string]: string;
}

// Placeholder responses map
const RESPONSES: PlaceholderResponses = {
    merhaba: 'Merhaba! Size nasıl yardımcı olabilirim?',
    hello: 'Hello! How can I help you?',
    hi: 'Hi there! How can I assist you today?',
    projeler: 'Projeler sayfasından tüm çalışmalarımı inceleyebilirsiniz.',
    projects: 'You can check all my projects on the projects page.',
    iletişim: 'İletişim sayfasından benimle iletişime geçebilirsiniz.',
    contact: 'You can contact me through the contact page.',
    blog: 'Blog sayfasından yazılarımı okuyabilirsiniz.',
    portfolio: 'Portfolio section showcases my best work.',
};

function getAIResponse(message: string): string {
    const messageLower = message.toLowerCase();

    // Check for keyword matches
    for (const [key, response] of Object.entries(RESPONSES)) {
        if (messageLower.includes(key)) {
            return response;
        }
    }

    // Default response
    return 'Mesajınız için teşekkürler. En kısa sürede size dönüş yapacağım.';
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatMessage = await request.json();
        const { message, session_id } = body;

        // Validate message
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Message is required',
                },
                { status: 400 }
            );
        }

        // Generate or use existing session ID
        const sessionId = session_id || uuidv4();

        // Get AI response (placeholder)
        const response = getAIResponse(message.trim());

        return NextResponse.json({
            success: true,
            data: {
                session_id: sessionId,
                message: message.trim(),
                response,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Chat API is running',
        methods: ['POST'],
        endpoint: '/api/chat',
    });
}
