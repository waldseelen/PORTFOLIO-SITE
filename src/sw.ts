import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// Service Worker type declarations
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
        registration: { showNotification(title: string, options?: NotificationOptions): Promise<void> };
        clients: {
            matchAll(options?: { type?: string; includeUncontrolled?: boolean }): Promise<{ url: string; focus(): Promise<unknown> }[]>;
            openWindow?(url: string): Promise<unknown>;
        };
    }
}

declare const self: WorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
        entries: [
            {
                url: '/offline',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});

// Handle skip waiting message from PWAUpdatePrompt
self.addEventListener('message', (event: MessageEvent) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // The skipWaiting option is already set to true in the Serwist config
        // This message handler is here for explicit control if needed
    }
});

// ============================================
// PUSH NOTIFICATION HANDLERS
// ============================================

interface PushEventData {
    title?: string;
    body?: string;
    icon?: string;
    url?: string;
    tag?: string;
    badge?: string;
}

/**
 * Push Notification Event Handler
 * Handles incoming push notifications from the server
 */
self.addEventListener('push', ((event: Event & { data?: { json(): PushEventData }; waitUntil(promise: Promise<unknown>): void }) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const { title, body, icon, url, tag, badge } = data;

        const options: NotificationOptions = {
            body: body || 'Yeni bir güncelleme var!',
            icon: icon || '/icon-192.png',
            badge: badge || '/icon-192.png',
            tag: tag || 'default',
            data: { url: url || '/' },
            requireInteraction: false,
            silent: false,
        };

        event.waitUntil(
            self.registration.showNotification(title || 'Portfolio', options)
        );
    } catch (error) {
        console.error('Push notification error:', error);
    }
}) as EventListener);

/**
 * Notification Click Event Handler
 * Handles user interactions with notifications
 */
self.addEventListener('notificationclick', ((event: Event & { notification: Notification; waitUntil(promise: Promise<unknown>): void }) => {
    event.notification.close();

    const notificationData = event.notification.data as { url?: string } | undefined;
    const urlToOpen = notificationData?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if a window is already open
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window if none found
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
}) as EventListener);

/**
 * Notification Close Event Handler
 * Tracks when notifications are dismissed
 */
self.addEventListener('notificationclose', ((event: Event & { notification: Notification }) => {
    // Analytics tracking could be added here
    console.warn('Notification closed:', event.notification.tag);
}) as EventListener);

serwist.addEventListeners();
