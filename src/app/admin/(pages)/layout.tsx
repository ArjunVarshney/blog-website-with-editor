import { Metadata } from 'next';

// components
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/base/sidebar';

export const metadata: Metadata = {
   title: 'Home | The Modern School',
   description: 'Home Page',
};

export default async function Layout({
   children,
}: {
   children: React.ReactNode;
}) {
   // if user session in present return the ui
   return (
      <SidebarProvider defaultOpen={true}>
         <AppSidebar />
         {children}
      </SidebarProvider>
   );
}
