'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="section flex min-h-[60vh] items-center justify-center">
            <div className="container-custom text-center">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <svg
                        className="h-12 w-12 text-red-600 dark:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="heading-2">Bir Hata Oluştu</h1>
                <p className="mx-auto mt-4 max-w-md text-neutral-600 dark:text-neutral-400">
                    Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
                </p>
                {error.digest && (
                    <p className="mt-2 text-sm text-neutral-500">
                        Hata Kodu: {error.digest}
                    </p>
                )}
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button onClick={reset} className="btn-primary">
                        Tekrar Dene
                    </button>
                    <Link href="/" className="btn-outline">
                        Ana Sayfaya Git
                    </Link>
                </div>
            </div>
        </div>
    );
}
