import { LucideProps } from 'lucide-react';

export type IconType = React.ForwardRefExoticComponent<
   Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export type SidebarInputType = {
   name: string;
   navs: {
      title: string;
      url: string;
      icon: IconType;
      submenu?: {
         title: string;
         url: string;
         icon: IconType;
      }[];
   }[];
}[];
