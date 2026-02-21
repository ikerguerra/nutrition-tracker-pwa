import apiClient from './apiClient';

// Use the exact same public key set in application-dev.yml
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuB-3qNd7tdMDaLNdOq11kBeh0';

/**
 * Utility to convert the base64 URL-safe string to a Uint8Array
 */
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const pushNotificationService = {
    async subscribe() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push messaging is not supported');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied');
                return false;
            }

            const registration = await navigator.serviceWorker.ready;

            // Unsubscribe existing if any to renew
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                await existingSubscription.unsubscribe();
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            // Parse the keys
            const subJSON = subscription.toJSON();
            const payload = {
                endpoint: subJSON.endpoint,
                p256dh: subJSON.keys?.p256dh,
                auth: subJSON.keys?.auth
            };

            await apiClient.post('/api/v1/notifications/subscribe', payload);
            console.log('Push subscription successful');
            return true;
        } catch (error) {
            console.error('Error subscribing to push notifications', error);
            return false;
        }
    },

    async checkPermission(): Promise<boolean> {
        if (!('Notification' in window)) return false;
        return Notification.permission === 'granted';
    }
};
