import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
