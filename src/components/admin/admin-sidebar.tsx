
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  LineChart,
  Home,
  Palette,
  PlusCircle, 
  ListOrdered, 
  Settings2, 
  ThumbsUp, // Added icon for Homepage Features
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar'; 

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Orders',
    icon: ShoppingCart,
    subItems: [
      { href: '/admin/orders', label: 'All Orders', icon: ListOrdered },
      { href: '/admin/orders/new', label: 'Add Manual Order', icon: PlusCircle },
    ]
  },
  {
    label: 'Catalog',
    icon: Package,
    subItems: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/categories', label: 'Categories', icon: Package }, 
    ]
  },
  { href: '/admin/users', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart }, 
  {
    label: 'Storefront Settings',
    icon: Settings2,
    subItems: [
      { href: '/admin/settings/homepage', label: 'Homepage Gallery', icon: Home },
      { href: '/admin/settings/homepage-features', label: 'Homepage Features', icon: ThumbsUp },
      { href: '/admin/settings/theme', label: 'Theme', icon: Palette }, 
    ]
  },
  { href: '/admin/settings', label: 'General Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/admin">
          <div className="flex items-center gap-2">
            <Store className="h-7 w-7 text-sidebar-primary" />
            <h1 className="font-headline text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              ARO Bazzar CMS
            </h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href || item.label}>
              {item.subItems ? (
                <SidebarGroup>
                  <SidebarMenuButton
                    isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                    tooltip={item.label}
                    className="justify-start w-full"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                  <div className="pl-4 group-data-[collapsible=icon]:hidden"> 
                    {item.subItems.map(subItem => (
                       <Link key={subItem.href} href={subItem.href}>
                         <SidebarMenuButton
                            isActive={pathname === subItem.href || (subItem.href !== '/admin' && pathname.startsWith(subItem.href))}
                            tooltip={subItem.label}
                            className="justify-start w-full text-sm h-9"
                            variant="ghost"
                          >
                          {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                          <span>{subItem.label}</span>
                        </SidebarMenuButton>
                       </Link>
                    ))}
                  </div>
                </SidebarGroup>
              ) : (
                <Link href={item.href!}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start w-full"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <Link href="/" target="_blank" rel="noopener noreferrer">
            <SidebarMenuButton tooltip="Visit Site" className="justify-start w-full">
                <Home className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Visit Site</span>
            </SidebarMenuButton>
        </Link>
        {/* Logout functionality should be handled by the Header or a context */}
        <SidebarMenuButton tooltip="Logout" className="justify-start w-full" disabled> 
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
