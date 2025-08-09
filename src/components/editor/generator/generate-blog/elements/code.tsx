import { SerializedCodeNode } from "@lexical/code";
import React from "react";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { cn } from "@/lib/utils";
import BlogComposer from "../blog-compose";
import {
   SerializedLexicalNode,
   SerializedRootNode,
   SerializedTextNode,
   Spread,
} from "lexical";

type SerializedCodeHighlightNode = Spread<
   {
      highlightType: string | null | undefined;
   },
   SerializedTextNode
>;

type Props = {
   node: SerializedCodeNode;
   className?: string;
};

const Code = ({ node, className }: Props) => {
   const nLines =
      node.children.filter((node) => node.type === "linebreak").length + 1;
   return (
      <code
         className={cn(editorTheme.code, className)}
         data-gutter={Array.from({ length: nLines })
            .map((_, index) => index + 1 + "\n")
            .join("")}
      >
         {node.children.map((childNode, index) => {
            if (childNode.type === "code-highlight") {
               const node = childNode as SerializedCodeHighlightNode;
               return (
                  <span
                     className={cn(
                        node.highlightType &&
                           editorTheme.codeHighlight?.[node.highlightType]
                     )}
                     key={index}
                  >
                     {node.text}
                  </span>
               );
            } else
               return (
                  <BlogComposer
                     key={index}
                     root={
                        childNode as SerializedRootNode<SerializedLexicalNode>
                     }
                  />
               );
         })}
      </code>
   );
};

export default Code;
