'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface PWAUpdatePromptProps {
    className?: string;
}

export function PWAUpdatePrompt({ className }: PWAUpdatePromptProps) {
    const [showUpdate, setShowUpdate] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        const handleControllerChange = () => {
            window.location.reload();
        };

        const handleRegistration = (registration: ServiceWorkerRegistration) => {
            // Check for waiting service worker
            if (registration.waiting) {
                setWaitingWorker(registration.waiting);
                setShowUpdate(true);
            }

            // Listen for new service worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        setWaitingWorker(newWorker);
                        setShowUpdate(true);
                    }
                });
            });
        };

        // Get current registration
        navigator.serviceWorker.ready.then(handleRegistration);

        // Listen for controller changes
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

        // Check for updates periodically (every hour)
        const interval = setInterval(() => {
            navigator.serviceWorker.getRegistration().then((registration) => {
                registration?.update();
            });
        }, 60 * 60 * 1000);

        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            clearInterval(interval);
        };
    }, []);

    const handleUpdate = () => {
        if (!waitingWorker) return;
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        setShowUpdate(false);
    };

    const handleDismiss = () => {
        setShowUpdate(false);
    };

    if (!showUpdate) return null;

    return (
        <div
            className={cn(
                'fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80',
                'animate-in slide-in-from-bottom-4 duration-300',
                className
            )}
            role="alert"
            aria-live="polite"
        >
            <div
                className={cn(
                    'rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl',
                    'dark:border-neutral-700 dark:bg-neutral-900'
                )}
            >
                <div className="flex items-start gap-3">
                    {/* Update Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <svg
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                            Güncelleme Mevcut
                        </h3>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Yeni bir sürüm mevcut. Güncellemek için yenileyin.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleDismiss}
                        className={cn(
                            'flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium',
                            'text-neutral-700 hover:bg-neutral-50',
                            'dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
                            'transition-colors'
                        )}
                    >
                        Sonra
                    </button>
                    <button
                        onClick={handleUpdate}
                        className={cn(
                            'flex-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white',
                            'hover:bg-green-700',
                            'transition-colors'
                        )}
                    >
                        Güncelle
                    </button>
                </div>
            </div>
        </div>
    );
}
