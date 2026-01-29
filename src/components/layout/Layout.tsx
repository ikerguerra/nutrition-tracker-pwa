import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';


interface LayoutProps {
    children: React.ReactNode;
    onAddFood?: () => void;
    onScanBarcode?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onAddFood, onScanBarcode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-10">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold">NutriTrack</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Actions from Header passed down */}
                            <Header
                                onAddFood={onAddFood}
                                onScanBarcode={onScanBarcode}
                                minimal
                            />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
