'use server';

import { cn } from '@/lib/utils';
import {
   SerializedLexicalNode,
   SerializedParagraphNode,
   SerializedRootNode,
   SerializedTextNode,
} from 'lexical';
import React, { CSSProperties } from 'react';
import { editorTheme } from '../../themes/editor-theme';
import { SerializedHeadingNode, SerializedQuoteNode } from '@lexical/rich-text';
import { SerializedListNode } from '@lexical/list';
import List from './elements/list';
import { SerializedCodeNode } from '@lexical/code';
import Code from './elements/code';
import {
   SerializedTableCellNode,
   SerializedTableNode,
   SerializedTableRowNode,
} from '@lexical/table';
import { SerializedImageNode } from '../../nodes/image-node';
import { SerializedInlineImageNode } from '../../nodes/inline-image-node';
import { SerializedCollapsibleContainerNode } from '../../nodes/collapsible-container-node';
import CollapsibleBtn from './elements/collapsible-btn';
import { SerializedExcalidrawNode } from '../../nodes/excalidraw-node';
import dynamic from 'next/dynamic';
import { parseInlineStyle } from '../../utils/inline-css-parser';
import { SerializedPollNode } from '../../nodes/poll-node';
import { SerializedLayoutContainerNode } from '../../nodes/layout-container-node';
import { SerializedTweetNode } from '../../nodes/embeds/tweet-node';
import { SerializedYouTubeNode } from '../../nodes/embeds/youtube-node';
import { SerializedFigmaNode } from '../../nodes/embeds/figma-node';

const Tweet = dynamic(() => import('./elements/tweet'));
const Excalidraw = dynamic(() => import('./elements/excalidraw'));

type Props = {
   root: SerializedRootNode<SerializedLexicalNode>;
   depth?: number;
};

const BlogComposer = ({ root, depth = 0 }: Props) => {
   const type = root.type;
   let content = <></>;
   const classNameArr: string[] = [];
   let styles: CSSProperties = {};
   if (root.direction) classNameArr.push(editorTheme[root.direction] || '');
   if (root.format && root.type === 'text') {
      const textStyles = editorTheme.text;
      if (textStyles) {
         const formatClasses = [
            textStyles.bold,
            textStyles.italic,
            textStyles.strikethrough,
            textStyles.underline,
            textStyles.code,
            textStyles.subscript,
            textStyles.superscript,
            textStyles.highlight,
         ];
         let format = Number(root.format || 0);
         let index = 0;
         while (format > 0) {
            const isFormatPresent = format & 1;
            format = format >> 1;
            if (isFormatPresent) classNameArr.push(formatClasses[index] || '');
            index++;
         }
      }
   }
   if (root.textStyle) {
      styles = parseInlineStyle(root.textStyle);
   }
   if (root.children) {
      content = (
         <>
            {root.children.map((node, index) => (
               <BlogComposer
                  root={node as SerializedRootNode}
                  depth={depth + 1}
                  key={index}
               />
            ))}
         </>
      );
   }
   const className = classNameArr.join(' ');
   switch (type) {
      case 'root': {
         if (!depth) return <div className={className}>{content}</div>;
         else return content;
      }
      case 'heading': {
         const headingNode = root as SerializedHeadingNode;
         return (
            <headingNode.tag
               className={cn(editorTheme.heading?.[headingNode.tag], className)}
               style={styles}
            >
               {content}
            </headingNode.tag>
         );
      }
      case 'text': {
         const textNode = root as unknown as SerializedTextNode;
         const content = (
            <span className={className} style={styles}>
               {textNode.text}
            </span>
         );
         if (className.includes('sub')) return <sub>{content}</sub>;
         if (className.includes('sup')) return <sup>{content}</sup>;
         if (className.includes('mark')) return <mark>{content}</mark>;
         return content;
      }
      case 'paragraph': {
         const paraNode = root as unknown as SerializedParagraphNode;
         if (!paraNode.children.length) content = <br />;
         if (depth <= 1)
            return (
               <p
                  className={cn(editorTheme.paragraph, className)}
                  style={styles}
               >
                  {content}
               </p>
            );
         else
            return (
               <span
                  className={cn(editorTheme.paragraph, className)}
                  style={styles}
               >
                  {content}
               </span>
            );
      }
      case 'list': {
         const listNode = root as unknown as SerializedListNode;
         return <List node={listNode} className={className} />;
      }
      case 'listitem': {
         return (
            <li
               role='checkbox'
               className={cn(editorTheme.list?.['listitem'], className)}
               style={styles}
            >
               {content}
            </li>
         );
      }
      case 'hashtag': {
         const hashNode = root as unknown as SerializedTextNode;
         return (
            <span className={cn(editorTheme.hashtag, className)}>
               {hashNode.text}
            </span>
         );
      }
      case 'code': {
         const codeNode = root as unknown as SerializedCodeNode;
         return <Code node={codeNode} className={className} />;
      }
      case 'linebreak': {
         return <br />;
      }
      case 'horizontalrule': {
         return <hr className={cn(editorTheme.hr, className)} />;
      }
      case 'quote': {
         return (
            <blockquote
               className={cn(editorTheme.quote, className)}
               style={styles}
            >
               {content}
            </blockquote>
         );
      }
      case 'table': {
         const tableNode = root as SerializedTableNode;
         return (
            <table className={cn(editorTheme.table, className)} style={styles}>
               {tableNode.colWidths && (
                  <colgroup>
                     {tableNode.colWidths.map((width, index) => (
                        <col style={{ width }} key={index} />
                     ))}
                  </colgroup>
               )}
               <tbody>{content}</tbody>
            </table>
         );
      }
      case 'tablerow': {
         const tableRowNode = root as unknown as SerializedTableRowNode;
         return (
            <tr style={{ ...styles, height: tableRowNode.height }}>
               {content}
            </tr>
         );
      }
      case 'tablecell': {
         const tableCellNode = root as unknown as SerializedTableCellNode;
         let Tag = 'td';
         if (tableCellNode.headerState) {
            Tag = 'th';
         }
         return React.createElement(
            Tag,
            {
               className: cn(
                  editorTheme.tableCell,
                  Tag == 'th' && editorTheme.tableCellHeader,
                  className,
               ),
               style: {
                  ...styles,
                  backgroundColor: tableCellNode.backgroundColor,
               },
            },
            content,
         );
      }
      case 'page-break': {
         return (
            <figure
               className={cn(editorTheme.pageBreak, className)}
               style={styles}
            />
         );
      }
      case 'image': {
         const imageNode = root as unknown as SerializedImageNode;
         return (
            <span className={cn(editorTheme.image, className)} style={styles}>
               <img
                  className='max-w-full cursor-default'
                  alt={imageNode.altText}
                  src={imageNode.src}
                  style={{
                     height: imageNode.height || 'inherit',
                     maxWidth: imageNode.maxWidth,
                     width: imageNode.width || 'inherit',
                  }}
               ></img>
               {imageNode.showCaption &&
                  !!imageNode.caption.editorState.root.children.length && (
                     <span className='image-caption-container absolute right-0 bottom-1 left-0 m-0 block min-w-[100px] overflow-hidden border-t bg-white/90 dark:bg-black/90 p-0'>
                        <span
                           className='ImageNode__contentEditable user-select-text word-break-break-word caret-primary relative block min-h-5 w-[calc(100%-20px)] cursor-text resize-none border-0 p-2.5 text-sm whitespace-pre-wrap outline-none'
                           suppressHydrationWarning
                        >
                           <BlogComposer
                              root={imageNode.caption.editorState.root}
                              depth={depth + 1}
                           />
                        </span>
                     </span>
                  )}
            </span>
         );
      }
      case 'inline-image': {
         const imageNode = root as unknown as SerializedInlineImageNode;
         return (
            <span
               className={cn(
                  editorTheme.inlineImage,
                  ['left', 'right'].includes(imageNode.position || '') &&
                     'w-1/2 float-' + imageNode.position,
                  imageNode.position === 'full' && 'w-full',
                  className,
               )}
               style={styles}
            >
               <span>
                  <img
                     className='max-w-full cursor-default'
                     alt={imageNode.altText}
                     src={imageNode.src}
                     style={{
                        height: imageNode.height || 'inherit',
                        width: imageNode.width || 'inherit',
                     }}
                  ></img>
               </span>
               {imageNode.showCaption &&
                  !!imageNode.caption.editorState.root.children.length && (
                     <span className='image-caption-container absolute right-0 bottom-1 left-0 m-0 block min-w-[100px] overflow-hidden border-t bg-white/90 dark:bg-black/90 p-0'>
                        <span
                           className='ImageNode__contentEditable user-select-text word-break-break-word caret-primary relative block min-h-5 w-[calc(100%-20px)] cursor-text resize-none border-0 p-2.5 text-sm whitespace-pre-wrap outline-none'
                           suppressHydrationWarning
                        >
                           <BlogComposer
                              root={imageNode.caption.editorState.root}
                              depth={depth + 1}
                           />
                        </span>
                     </span>
                  )}
            </span>
         );
      }
      case 'collapsible-container': {
         const node = root as SerializedCollapsibleContainerNode;
         return (
            <div
               className={cn('Collapsible__container', className)}
               // @ts-expect-error: just needed for css to work
               open={node.open}
            >
               {content}
            </div>
         );
      }
      case 'collapsible-title': {
         return (
            <CollapsibleBtn
               className={cn(className, '[&>*]:pointer-events-none')}
            >
               {content}
            </CollapsibleBtn>
         );
      }
      case 'collapsible-content': {
         return (
            <div className='Collapsible__content pt-0 pr-1 pb-1 pl-4 overflow-hidden h-0'>
               {content}
            </div>
         );
      }
      case 'excalidraw': {
         const node = root as unknown as SerializedExcalidrawNode;
         return (
            <span className={cn(editorTheme.image, className)} style={styles}>
               <Excalidraw
                  node={node}
                  height={node.height}
                  width={node.width}
                  className={className}
               />
            </span>
         );
      }
      case 'poll': {
         const node = root as unknown as SerializedPollNode;
         return '';
      }
      case 'layout-container': {
         const layoutContainerNode =
            root as unknown as SerializedLayoutContainerNode;
         return (
            <span
               className={cn(editorTheme.layoutContainer)}
               style={{
                  ...styles,
                  gridTemplateColumns: layoutContainerNode.templateColumns,
               }}
            >
               {content}
            </span>
         );
      }
      case 'layout-item': {
         return <span className={cn(editorTheme.layoutItem)}>{content}</span>;
      }
      case 'tweet': {
         const tweetNode = root as unknown as SerializedTweetNode;
         return (
            <div className='user-select-none'>
               <Tweet tweetID={tweetNode.id} />
            </div>
         );
      }
      case 'youtube': {
         const ytNode = root as unknown as SerializedYouTubeNode;
         return (
            <iframe
               width='560'
               height='315'
               src={`https://www.youtube-nocookie.com/embed/${ytNode.videoID}`}
               frameBorder='0'
               allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
               allowFullScreen={true}
               title='YouTube video'
            />
         );
      }
      case 'figma': {
         const figmaNode = root as unknown as SerializedFigmaNode;
         return (
            <iframe
               width='560'
               height='315'
               src={`https://www.figma.com/embed?embed_host=lexical&url=\
        https://www.figma.com/file/${figmaNode.documentID}`}
               allowFullScreen={true}
            />
         );
      }
   }
   return null;
};

export default BlogComposer;
