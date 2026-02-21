import React from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="bg-amber-500 text-white p-2 text-center flex items-center justify-center gap-2 sticky flex-col sm:flex-row z-[100] top-0 shadow-md animate-in slide-in-from-top-full duration-300">
            <WifiOff size={18} />
            <span className="font-medium text-sm">
                Estás sin conexión. La app seguirá funcionando con los datos guardados localmente.
            </span>
        </div>
    );
};
