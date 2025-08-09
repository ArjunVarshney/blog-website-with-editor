import { cn } from "@/lib/utils";
import {
   SerializedLexicalNode,
   SerializedParagraphNode,
   SerializedRootNode,
   SerializedTextNode,
   Spread,
} from "lexical";
import React from "react";
import { editorTheme } from "../../themes/editor-theme";
import { SerializedHeadingNode, SerializedQuoteNode } from "@lexical/rich-text";
import { SerializedListNode } from "@lexical/list";
import List from "./elements/list";
import { SerializedCodeNode } from "@lexical/code";
import Code from "./elements/code";
import {
   SerializedTableCellNode,
   SerializedTableNode,
   SerializedTableRowNode,
} from "@lexical/table";
import { PageBreakNode } from "../../nodes/page-break-node";

type Props = {
   root: SerializedRootNode<SerializedLexicalNode>;
   depth?: number;
};

const BlogComposer = ({ root, depth = 0 }: Props) => {
   const type = root.type;
   let content = <></>;
   const classNameArr: string[] = [];
   if (root.direction) classNameArr.push(editorTheme[root.direction] || "");
   if (root.format && root.type === "text") {
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
            if (isFormatPresent) classNameArr.push(formatClasses[index] || "");
            index++;
         }
      }
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
   const className = classNameArr.join(" ");
   switch (type) {
      case "root": {
         return <div className={className}>{content}</div>;
      }
      case "heading": {
         const headingNode = root as SerializedHeadingNode;
         return (
            <headingNode.tag
               className={cn(editorTheme.heading?.[headingNode.tag], className)}
            >
               {content}
            </headingNode.tag>
         );
      }
      case "text": {
         const textNode = root as unknown as SerializedTextNode;
         const content = <span className={className}>{textNode.text}</span>;
         if (className.includes("sub")) return <sub>{content}</sub>;
         if (className.includes("sup")) return <sup>{content}</sup>;
         if (className.includes("mark")) return <mark>{content}</mark>;
         return content;
      }
      case "paragraph": {
         const paraNode = root as unknown as SerializedParagraphNode;
         if (!paraNode.children.length) content = <br />;
         return (
            <p className={cn(editorTheme.paragraph, className)}>{content}</p>
         );
      }
      case "list": {
         const listNode = root as unknown as SerializedListNode;
         return <List node={listNode} className={className} />;
      }
      case "listitem": {
         return (
            <li
               role="checkbox"
               className={cn(editorTheme.list?.["listitem"], className)}
            >
               {content}
            </li>
         );
      }
      case "hashtag": {
         const hashNode = root as unknown as SerializedTextNode;
         return (
            <span className={cn(editorTheme.hashtag, className)}>
               {hashNode.text}
            </span>
         );
      }
      case "code": {
         const codeNode = root as unknown as SerializedCodeNode;
         return <Code node={codeNode} className={className} />;
      }
      case "linebreak": {
         return <br />;
      }
      case "horizontalrule": {
         return <hr className={cn(editorTheme.hr, className)} />;
      }
      case "quote": {
         const quoteNode = root as SerializedQuoteNode;
         return (
            <blockquote className={cn(editorTheme.quote, className)}>
               {content}
            </blockquote>
         );
      }
      case "table": {
         const tableNode = root as SerializedTableNode;
         return (
            <table className={cn(editorTheme.table, className)}>
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
      case "tablerow": {
         const tableRowNode = root as unknown as SerializedTableRowNode;
         return <tr style={{ height: tableRowNode.height }}>{content}</tr>;
      }
      case "tablecell": {
         const tableCellNode = root as unknown as SerializedTableCellNode;
         let Tag = "td";
         if (tableCellNode.headerState) {
            Tag = "th";
         }
         return React.createElement(
            Tag,
            {
               className: cn(
                  editorTheme.tableCell,
                  Tag == "th" && editorTheme.tableCellHeader,
                  className
               ),
               style: { backgroundColor: tableCellNode.backgroundColor },
            },
            content
         );
      }
      case "page-break": {
         return <figure className={cn(editorTheme.pageBreak, className)} />;
      }
   }
   return null;
};

export default BlogComposer;
