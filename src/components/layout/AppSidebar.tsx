'use client'

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    Calendar,
    ChefHat,
    ChevronUp,
    CreditCard,
    Home,
    LayoutDashboard,
    LogOut,
    PieChart,
    Settings,
    User,
    Users,
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
    SidebarSeparator,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
    const { logout, user } = useAuth()
    const location = useLocation()

    const navItems = [
        {
            to: '/',
            label: 'Diario',
            icon: Home,
        },
        {
            to: '/calendar',
            label: 'Calendario',
            icon: Calendar,
        },
        {
            to: '/templates',
            label: 'Plantillas',
            icon: LayoutDashboard,
        },
        {
            to: '/recipes',
            label: 'Recetas',
            icon: ChefHat,
        },
        {
            to: '/stats',
            label: 'Estadísticas',
            icon: PieChart,
        },
        {
            to: '/profile',
            label: 'Mi Perfil',
            icon: User,
        },
    ]

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
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
            <SidebarFooter>
                <SidebarMenu>
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
                                        <span className="truncate font-semibold">{user?.firstName || 'Usuario'}</span>
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
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
