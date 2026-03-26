/**
 * Content Factory V10.1 — Real-Time Sync Layer (Mock Firebase)
 * Uses BroadcastChannel for instant cross-tab state mirroring.
 */

const SyncEngine = (() => {
    const CHANNEL_NAME = 'factory_v10_sync';
    const channel = new BroadcastChannel(CHANNEL_NAME);

    const init = (onSync) => {
        channel.onmessage = (event) => {
            console.log('[SyncEngine] Received Update:', event.detail || event.data);
            if (onSync) onSync(event.detail || event.data);
        };
    };

    const push = (payload) => {
        console.log('[SyncEngine] Pushing Update:', payload);
        channel.postMessage(payload);
    };

    return { init, push };
})();

window.SyncEngine = SyncEngine;
