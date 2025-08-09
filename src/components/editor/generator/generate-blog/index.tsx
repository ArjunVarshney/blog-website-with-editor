import { SerializedEditorState, SerializedLexicalNode } from "lexical";
import React from "react";
import BlogComposer from "./blog-compose";

type Props = {
   blogJson: SerializedEditorState<SerializedLexicalNode>;
};

const GenerateBlog = ({ blogJson }: Props) => {
   const rootContent = blogJson?.root;
   if (!rootContent)
      return "Cannot find the content / It is not in proper lexical JSON format";

   return (
      <div className="p-8">
         <BlogComposer root={rootContent} />
      </div>
   );
};

export default GenerateBlog;
