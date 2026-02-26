'use client'

import { NavLink, useLocation } from 'react-router-dom'
import {
    Calendar,
    ChefHat,
    ChevronUp,
    Home,
    LayoutDashboard,
    LogOut,
    PieChart,
    Trophy,
    User,
} from 'lucide-react'
import { useAuth } from '@hooks/useAuth'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '@components/common/LanguageSelector'
import { ModeToggle } from '@components/common/ModeToggle'

export function AppSidebar() {
    const { t } = useTranslation();
    const { logout, user } = useAuth()
    const location = useLocation()

    const navItems = [
        {
            to: '/',
            label: t('nav.dashboard'),
            icon: Home,
        },
        {
            to: '/calendar',
            label: t('nav.calendar'),
            icon: Calendar,
        },
        {
            to: '/templates',
            label: t('nav.templates'),
            icon: LayoutDashboard,
        },
        {
            to: '/recipes',
            label: t('nav.recipes'),
            icon: ChefHat,
        },
        {
            to: '/stats',
            label: t('nav.stats'),
            icon: PieChart,
        },
        {
            to: '/nutrition-breakdown',
            label: t('nav.breakdown'),
            icon: LayoutDashboard,
        },
        {
            to: '/achievements',
            label: t('nav.achievements'),
            icon: Trophy,
        },
        {
            to: '/profile',
            label: t('nav.profile'),
            icon: User,
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="safe-area-pt">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <LayoutDashboard className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">NutriTrack</span>
                                    <span className="truncate text-xs">PWA Edition</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.to}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.to} tooltip={item.label}>
                                        <NavLink to={item.to}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="safe-area-pb">
                <SidebarMenu>
                    <div className="px-2 py-2 flex gap-2">
                        <LanguageSelector />
                        <ModeToggle />
                    </div>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
                                        <AvatarFallback className="rounded-lg">{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.firstName || 'Usuario'} {user?.lastName || ''}</span>
                                        <span className="truncate text-xs">{user?.email || 'email@example.com'}</span>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            >
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>{t('nav.logout')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
