'use client';

import {
   Home,
   Settings,
   UserCog,
   User,
   UserPlus,
   GraduationCap,
   BookUser,
   School,
   CircleFadingArrowUp,
   Shapes,
   Book,
   BookPlus,
   FileUser,
   Sheet,
   Presentation,
   BookOpenCheck,
   CalendarDays,
   Speech,
   CalendarCog,
   StickyNote,
   OctagonX,
   Award,
   ChevronRight,
   List,
   CirclePlus,
   Archive,
   Files,
} from 'lucide-react';
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
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/base/mode-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import React from 'react';
import { SidebarInputType } from '@/types/base-types';

export function AppSidebar() {
   const pathname = usePathname();

   // Menu items.
   const items: SidebarInputType = [
      {
         name: '',
         navs: [
            {
               title: 'Home',
               url: '/dashboard',
               icon: Home,
            },
            {
               title: 'Settings',
               url: '/settings',
               icon: Settings,
            },
         ],
      },
      {
         name: 'Admin',
         navs: [
            {
               title: 'Blogs',
               url: '/admin/blogs',
               icon: Files,
               submenu: [
                  {
                     title: 'List',
                     url: '/admin/blogs',
                     icon: List,
                  },
                  {
                     title: 'Create',
                     url: '/admin/blogs/new',
                     icon: CirclePlus,
                  },
               ],
            },
         ],
      },
   ];

   return (
      <Sidebar>
         <SidebarHeader className='bg-background border-b'>
            <div className='flex gap-2 items-center p-1.5 font-semibold'>
               <School className='bg-white dark:bg-slate-900 border rounded-lg p-1 w-8 h-8' />
               <span className='font-semibold leading-5'>
                  The Modern School
               </span>
            </div>
         </SidebarHeader>
         <SidebarContent className='gap-0 scrollbar scrollbar-thumb-sidebar bg-background'>
            {items.map(({ name, navs }, index) => (
               <SidebarGroup key={name + index}>
                  {name && <SidebarGroupLabel>{name}</SidebarGroupLabel>}
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {navs.map((item) => {
                           if (!item.submenu)
                              return (
                                 <SidebarMenuItem
                                    key={item.title}
                                    className={cn(
                                       'rounded',
                                       item.url == pathname && 'bg-secondary',
                                    )}
                                 >
                                    <SidebarMenuButton asChild>
                                       <a href={item.url}>
                                          <item.icon />
                                          <span>{item.title}</span>
                                       </a>
                                    </SidebarMenuButton>
                                 </SidebarMenuItem>
                              );
                           else
                              return (
                                 <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={pathname.startsWith(item.url)}
                                    open={pathname.startsWith(item.url)}
                                    className='group/collapsible'
                                 >
                                    <SidebarMenuItem>
                                       <Link href={item.url}>
                                          <CollapsibleTrigger asChild>
                                             <SidebarMenuButton
                                                tooltip={item.title}
                                             >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                                             </SidebarMenuButton>
                                          </CollapsibleTrigger>
                                       </Link>
                                       <CollapsibleContent>
                                          <SidebarMenuSub>
                                             {item.submenu?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                   key={subItem.title}
                                                >
                                                   <SidebarMenuSubButton
                                                      asChild
                                                   >
                                                      <Link
                                                         href={subItem.url}
                                                         className={cn(
                                                            subItem.url ==
                                                               pathname &&
                                                               'bg-secondary',
                                                         )}
                                                      >
                                                         {subItem.icon && (
                                                            <subItem.icon />
                                                         )}
                                                         <span>
                                                            {subItem.title}
                                                         </span>
                                                      </Link>
                                                   </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                             ))}
                                          </SidebarMenuSub>
                                       </CollapsibleContent>
                                    </SidebarMenuItem>
                                 </Collapsible>
                              );
                        })}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}
         </SidebarContent>
         <SidebarFooter className='bg-background border-t'>
            <ModeToggle />
         </SidebarFooter>
      </Sidebar>
   );
}
