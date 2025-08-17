import { editorTheme } from '@/components/editor/themes/editor-theme';
import { cn } from '@/lib/utils';
import { SerializedListItemNode, SerializedListNode } from '@lexical/list';
import React from 'react';
import BlogComposer from '../blog-compose';
import { SerializedLexicalNode, SerializedRootNode } from 'lexical';

type Props = {
   node: SerializedListNode;
   listDepth?: number;
   className?: string;
};

const TAG_STYLE_MAP: Record<string, 'ul' | 'ol' | 'checklist'> = {
   number: 'ol',
   bullet: 'ul',
   check: 'checklist',
};

const CHECKLIST_CHECK_MAP: Record<
   string,
   'listitemChecked' | 'listitemUnchecked'
> = {
   true: 'listitemChecked',
   false: 'listitemUnchecked',
};

const List = ({ node, className, listDepth = 0 }: Props) => {
   const depthStyles = editorTheme.list?.[
      (node.tag + 'Depth') as 'ulDepth' | 'olDepth'
   ] as unknown as string[];

   return (
      <node.tag
         className={cn(
            editorTheme.list?.[TAG_STYLE_MAP[node.listType]],
            node.listType == 'check' && editorTheme.list?.['ul'],
            depthStyles[listDepth],
            className,
         )}
      >
         {node.children.map((childNode, index) => {
            if (childNode.type === 'listitem') {
               const listItemNode = childNode as SerializedListItemNode;
               const hasNestedList = listItemNode.children.find(
                  (node) => node.type === 'list',
               );
               return (
                  <li
                     className={cn(
                        node.listType == 'check' &&
                           editorTheme.list?.[
                              CHECKLIST_CHECK_MAP[
                                 String(!!listItemNode.checked)
                              ]
                           ],
                        editorTheme.list?.['listitem'],
                        hasNestedList && editorTheme.list?.nested?.listitem,
                        className,
                     )}
                     key={index}
                  >
                     {listItemNode.children.map((child, index) => {
                        if (
                           child.type === 'list' &&
                           (child as SerializedListNode).tag === node.tag
                        )
                           return (
                              <List
                                 node={child as SerializedListNode}
                                 listDepth={listDepth + 1}
                                 key={index}
                              />
                           );
                        else
                           return (
                              <BlogComposer
                                 root={
                                    child as SerializedRootNode<SerializedLexicalNode>
                                 }
                                 key={index}
                              />
                           );
                     })}
                  </li>
               );
            } else
               return (
                  <BlogComposer
                     root={
                        childNode as SerializedRootNode<SerializedLexicalNode>
                     }
                     key={index}
                  />
               );
         })}
      </node.tag>
   );
};

export default List;
