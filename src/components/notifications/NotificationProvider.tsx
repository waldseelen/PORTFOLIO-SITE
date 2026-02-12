'use client';

import { useNotification } from '@/hooks/useNotification';
import { cn } from '@/lib/utils';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
    permission: NotificationPermission;
    isSupported: boolean;
    requestPermission: () => Promise<NotificationPermission>;
    sendNotification: (title: string, body?: string, onClick?: () => void) => void;
    showPermissionBanner: boolean;
    dismissBanner: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
    children: ReactNode;
}

/**
 * Notification Provider component
 * Wraps the app to provide notification capabilities throughout
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
    const { permission, isSupported, requestPermission, sendNotification } = useNotification();
    const [showPermissionBanner, setShowPermissionBanner] = useState(false);

    useEffect(() => {
        // Check if we should show permission banner
        if (isSupported && permission === 'default') {
            const dismissed = localStorage.getItem('notification-banner-dismissed');
            if (!dismissed) {
                // Show after 5 seconds for better UX
                const timer = setTimeout(() => setShowPermissionBanner(true), 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [isSupported, permission]);

    const dismissBanner = useCallback(() => {
        setShowPermissionBanner(false);
        localStorage.setItem('notification-banner-dismissed', Date.now().toString());
    }, []);

    const handleSendNotification = useCallback(
        (title: string, body?: string, onClick?: () => void) => {
            sendNotification({
                title,
                body,
                onClick,
            });
        },
        [sendNotification]
    );

    return (
        <NotificationContext.Provider
            value={{
                permission,
                isSupported,
                requestPermission,
                sendNotification: handleSendNotification,
                showPermissionBanner,
                dismissBanner,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

/**
 * Hook to use notification context
 */
export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
}

/**
 * Notification Permission Banner component
 * Shows a banner to request notification permission
 */
export function NotificationPermissionBanner() {
    const { permission, isSupported, requestPermission, showPermissionBanner, dismissBanner } =
        useNotificationContext();

    const handleEnable = async () => {
        await requestPermission();
        dismissBanner();
    };

    useEffect(() => {
        if (!showPermissionBanner) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                dismissBanner();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [dismissBanner, showPermissionBanner]);

    if (!isSupported || !showPermissionBanner || permission !== 'default') {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96',
                'animate-in slide-in-from-bottom-4 duration-300'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-banner-title"
            aria-describedby="notification-banner-description"
        >
            <div
                className={cn(
                    'rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl',
                    'dark:border-neutral-700 dark:bg-neutral-900'
                )}
            >
                <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <span className="text-xl">🔔</span>
                    </div>
                    <div className="flex-1">
                        <h3
                            id="notification-banner-title"
                            className="text-sm font-semibold text-neutral-900 dark:text-neutral-50"
                        >
                            Bildirimleri Etkinleştir
                        </h3>
                        <p
                            id="notification-banner-description"
                            className="mt-1 text-xs text-neutral-600 dark:text-neutral-400"
                        >
                            Yeni mesajlar ve güncellemelerden haberdar olmak için bildirimleri açın.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleEnable}
                        className={cn(
                            'flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white',
                            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                            'transition-colors duration-200'
                        )}
                    >
                        Etkinleştir
                    </button>
                    <button
                        type="button"
                        onClick={dismissBanner}
                        className={cn(
                            'rounded-lg px-4 py-2 text-sm font-medium',
                            'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
                            'focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
                            'transition-colors duration-200'
                        )}
                    >
                        Sonra
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotificationProvider;
