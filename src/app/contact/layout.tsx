import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'İletişim',
    description: 'Benimle iletişime geçin. Proje teklifi, işbirliği veya sorularınız için form aracılığıyla ulaşabilirsiniz.',
    openGraph: {
        title: 'İletişim',
        description: 'Benimle iletişime geçin. Proje teklifi, işbirliği veya sorularınız için.',
        type: 'website',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
