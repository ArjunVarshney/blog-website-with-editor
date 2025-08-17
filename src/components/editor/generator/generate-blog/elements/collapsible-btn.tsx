'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
   children: React.ReactNode;
   className?: string;
};

const CollapsibleBtn = ({ children, className }: Props) => {
   return (
      <summary
         className={cn('Collapsible__title', className)}
         onClick={(e) => {
            const parent = e.currentTarget.parentElement;
            parent?.toggleAttribute('open');
         }}
      >
         {children}
      </summary>
   );
};

export default CollapsibleBtn;
