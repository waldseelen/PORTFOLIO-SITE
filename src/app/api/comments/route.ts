import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

// Sanity client with write access
const client = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    ? createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2026-01-18',
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
    })
    : null;

// Rate limiting for comment submissions
const rateLimiter = new Map<string, { count: number; lastTime: number }>();
const RATE_LIMIT_TIME = 60 * 1000; // 1 minute
const RATE_LIMIT_COUNT = 3; // 3 comments per minute

/**
 * GET /api/comments
 * Retrieve approved comments for a specific post
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postSlug = searchParams.get('post');

        if (!postSlug) {
            return NextResponse.json(
                { message: 'Post slug is required' },
                { status: 400 }
            );
        }

        if (!client) {
            return NextResponse.json(
                { message: 'Sanity client not configured' },
                { status: 503 }
            );
        }

        // Fetch approved comments for the post
        const comments = await client.fetch(
            `*[_type == "comment" && post->slug.current == $slug && status == "approved"] | order(createdAt desc) {
                _id,
                author,
                content,
                createdAt,
                "replies": *[_type == "comment" && parentComment._ref == ^._id && status == "approved"] | order(createdAt asc) {
                    _id,
                    author,
                    content,
                    createdAt
                }
            }`,
            { slug: postSlug }
        );

        return NextResponse.json({
            success: true,
            comments,
            count: comments.length,
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { message: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/comments
 * Submit a new comment (requires moderation)
 */
export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Rate limiting
        const now = Date.now();
        const userRate = rateLimiter.get(ip);
        if (userRate) {
            if (now - userRate.lastTime < RATE_LIMIT_TIME) {
                if (userRate.count >= RATE_LIMIT_COUNT) {
                    return NextResponse.json(
                        { message: 'Çok fazla yorum gönderildi. Lütfen bekleyin.' },
                        { status: 429 }
                    );
                }
                userRate.count++;
            } else {
                rateLimiter.set(ip, { count: 1, lastTime: now });
            }
        } else {
            rateLimiter.set(ip, { count: 1, lastTime: now });
        }

        const { postId, author, email, content, parentCommentId, honeypot } = await request.json();

        // Honeypot check
        if (honeypot) {
            return NextResponse.json({ success: true, message: 'Yorum gönderildi.' });
        }

        // Validation
        if (!postId || !author || !email || !content) {
            return NextResponse.json(
                { message: 'Tüm alanlar zorunludur.' },
                { status: 400 }
            );
        }

        if (author.length < 2 || author.length > 100) {
            return NextResponse.json(
                { message: 'İsim 2-100 karakter arasında olmalıdır.' },
                { status: 400 }
            );
        }

        if (content.length < 3 || content.length > 2000) {
            return NextResponse.json(
                { message: 'Yorum 3-2000 karakter arasında olmalıdır.' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Geçerli bir e-posta adresi girin.' },
                { status: 400 }
            );
        }

        if (!client) {
            return NextResponse.json(
                { message: 'Yorum sistemi yapılandırılmamış.' },
                { status: 503 }
            );
        }

        // Create comment document
        const commentDoc = {
            _type: 'comment',
            post: { _type: 'reference', _ref: postId },
            author,
            email,
            content,
            status: 'pending', // All comments require moderation
            createdAt: new Date().toISOString(),
            ipAddress: ip,
            userAgent: userAgent,
            ...(parentCommentId && {
                parentComment: { _type: 'reference', _ref: parentCommentId },
            }),
        };

        await client.create(commentDoc);

        return NextResponse.json({
            success: true,
            message: 'Yorumunuz gönderildi ve onay bekliyor.',
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { message: 'Yorum gönderilemedi.' },
            { status: 500 }
        );
    }
}
