import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sayfa Bulunamadı',
    description: 'Aradığınız sayfa bulunamadı.',
};

export default function NotFound() {
    return (
        <div className="section flex min-h-[60vh] items-center justify-center">
            <div className="container-custom text-center">
                <p className="text-8xl font-bold text-primary-600 dark:text-primary-400">404</p>
                <h1 className="mt-4 heading-2">Sayfa Bulunamadı</h1>
                <p className="mx-auto mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link href="/" className="btn-primary">
                        Ana Sayfaya Git
                    </Link>
                    <Link href="/contact" className="btn-outline">
                        İletişime Geç
                    </Link>
                </div>
            </div>
        </div>
    );
}
