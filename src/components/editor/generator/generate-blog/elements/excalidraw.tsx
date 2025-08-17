'use client';

import { removeStyleFromSvg_HACK } from '@/components/editor/editor-ui/excalidraw-image';
import { SerializedExcalidrawNode } from '@/components/editor/nodes/excalidraw-node';
import { exportToSvg } from '@excalidraw/excalidraw';
import React, { useEffect, useState } from 'react';

type Props = {
   node: SerializedExcalidrawNode;
   className?: string;
   width?: string | number;
   height?: string | number;
};

const Excalidraw = ({
   node,
   className,
   width = 'inherit',
   height = 'inherit',
}: Props) => {
   const [Svg, setSvg] = useState<SVGElement | null>(null);

   useEffect(() => {
      const setContent = async () => {
         const svg: SVGElement = await exportToSvg(JSON.parse(node.data));
         removeStyleFromSvg_HACK(svg);

         svg.setAttribute('width', '100%');
         svg.setAttribute('height', '100%');
         svg.setAttribute('display', 'block');

         setSvg(svg);
      };
      setContent();
   }, [node]);

   const containerStyle: React.CSSProperties = {};
   if (width !== 'inherit') {
      containerStyle.width = `${width}px`;
   }
   if (height !== 'inherit') {
      containerStyle.height = `${height}px`;
   }

   return (
      <span
         className={className}
         style={containerStyle}
         dangerouslySetInnerHTML={{ __html: Svg?.outerHTML ?? '' }}
      />
   );
};

export default Excalidraw;
