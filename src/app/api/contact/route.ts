import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Sanity Client with Write Token
const client = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-01-18',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false, // We need fresh data for writes
}) : null;

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple in-memory rate limiter (Note: resets on serverless cold starts)
const rateLimit = new Map<string, { count: number; lastTime: number }>();
const LIMIT_TIME = 5 * 60 * 1000; // 5 minutes
const LIMIT_COUNT = 5;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, surname, email, subject, message, honeypot } = body;

        // Get IP for rate limiting (Headers might vary based on hosting)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referer = request.headers.get('referer') || 'unknown';

        // 1. Spam Protection: Honeypot
        if (honeypot) {
            // Silently fail for bots
            return NextResponse.json({ message: 'Mesajınız başarıyla gönderildi.', success: true });
        }

        // 2. Spam Protection: Rate Limiting
        const currentTime = Date.now();
        const userRate = rateLimit.get(ip);

        if (userRate) {
            if (currentTime - userRate.lastTime < LIMIT_TIME) {
                if (userRate.count >= LIMIT_COUNT) {
                    return NextResponse.json(
                        { message: 'Çok fazla mesaj gönderdiniz. Lütfen 5 dakika bekleyin.' },
                        { status: 429 }
                    );
                }
                userRate.count++;
            } else {
                // Reset after time limit
                rateLimit.set(ip, { count: 1, lastTime: currentTime });
            }
        } else {
            rateLimit.set(ip, { count: 1, lastTime: currentTime });
        }

        // 3. Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { message: 'Tüm alanlar zorunludur.' },
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

        // 4. Save to Sanity
        if (client && process.env.SANITY_API_WRITE_TOKEN) {
            await client.create({
                _type: 'contactMessage',
                name,
                surname,
                email,
                subject,
                message,
                read: false,
                createdAt: new Date().toISOString(),
                ipAddress: ip,
                userAgent: userAgent,
                referrer: referer,
            });
        } else {
            console.warn('SANITY_API_WRITE_TOKEN not found. Message not saved to Sanity.');
        }

        // 5. Send Email Notification
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Contact Form <onboarding@resend.dev>', // Update this with your verified domain in production
                    to: 'bugra.kocakahya@gmail.com', // Ideally from env var (e.g. ADMIN_EMAIL)
                    subject: `[Portfolio Contact] ${subject}`,
                    html: `
                        <h2>Yeni İletişim Mesajı</h2>
                        <p><strong>Gönderen:</strong> ${name} ${surname || ''}</p>
                        <p><strong>E-posta:</strong> ${email}</p>
                        <p><strong>Konu:</strong> ${subject}</p>
                        <p><strong>Mesaj:</strong></p>
                        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                            ${message.replace(/\n/g, '<br>')}
                        </blockquote>
                        <br>
                        <p><small>IP: ${ip}</small></p>
                    `,
                });
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Don't fail the request if email fails, Sanity saved it.
            }
        } else {
            console.warn('RESEND_API_KEY not found. Email not sent.');
        }

        return NextResponse.json({
            message: 'Mesajınız başarıyla gönderildi.',
            success: true,
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
            { status: 500 }
        );
    }
}
