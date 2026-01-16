import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { message: 'Tüm alanlar zorunludur.' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Geçerli bir e-posta adresi girin.' },
                { status: 400 }
            );
        }

        // TODO: Integrate with email service (SendGrid, Resend, etc.)
        // Example with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'noreply@yourdomain.com',
        //   to: 'your@email.com',
        //   subject: `[Contact Form] ${subject}`,
        //   html: `
        //     <h2>Yeni İletişim Formu</h2>
        //     <p><strong>İsim:</strong> ${name}</p>
        //     <p><strong>E-posta:</strong> ${email}</p>
        //     <p><strong>Konu:</strong> ${subject}</p>
        //     <p><strong>Mesaj:</strong></p>
        //     <p>${message}</p>
        //   `,
        // });

        // TODO: Implement actual email sending in production
        // For now, we just validate and return success

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
