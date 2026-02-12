'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
    className?: string;
}

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if dismissed recently (within 7 days)
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedAt) {
            const dismissedDate = new Date(parseInt(dismissedAt));
            const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                return;
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show after a delay for better UX
            setTimeout(() => setIsVisible(true), 3000);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsVisible(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
        } catch (error) {
            console.error('Error installing PWA:', error);
        } finally {
            setIsVisible(false);
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    useEffect(() => {
        if (!isVisible) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsVisible(false);
                localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isVisible]);

    if (!isVisible || isInstalled) return null;

    return (
        <div
            className={cn(
                'fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96',
                'animate-in slide-in-from-bottom-4 duration-300',
                className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-prompt-title"
            aria-describedby="pwa-prompt-description"
        >
            <div
                className={cn(
                    'rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl',
                    'dark:border-neutral-700 dark:bg-neutral-900'
                )}
            >
                <div className="flex items-start gap-4">
                    {/* App Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                        <svg
                            className="h-6 w-6 text-primary-600 dark:text-primary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <div className="flex-1">
                        <h3
                            id="pwa-prompt-title"
                            className="text-sm font-semibold text-neutral-900 dark:text-neutral-50"
                        >
                            Uygulamayı Yükle
                        </h3>
                        <p
                            id="pwa-prompt-description"
                            className="mt-1 text-sm text-neutral-600 dark:text-neutral-400"
                        >
                            Bu siteyi ana ekranınıza ekleyerek daha hızlı erişebilirsiniz.
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                        aria-label="Kapat"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className={cn(
                            'flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium',
                            'text-neutral-700 hover:bg-neutral-50',
                            'dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
                            'transition-colors'
                        )}
                    >
                        Daha Sonra
                    </button>
                    <button
                        type="button"
                        onClick={handleInstall}
                        className={cn(
                            'flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white',
                            'hover:bg-primary-700',
                            'transition-colors'
                        )}
                    >
                        Yükle
                    </button>
                </div>
            </div>
        </div>
    );
}
