import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
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
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        // The skipWaiting option is already set to true in the Serwist config
        // This message handler is here for explicit control if needed
    }
});

serwist.addEventListeners();
