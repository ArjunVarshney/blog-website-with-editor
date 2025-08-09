import GenerateBlog from "@/components/editor/generator/generate-blog";
import { editorState } from "@/helpers/test-editor-state";
import { jsontohtml } from "jsontohtml-render";
import React from "react";

type Props = {};

const BlogPage = (props: Props) => {
   return (
      <div className="flex h-screen">
         <div className="w-full bg-background max-h-screen overflow-y-scroll">
            <GenerateBlog blogJson={editorState} />
         </div>
         <div className="w-full overflow-x-hidden overflow-y-scroll bg-black">
            <div
               dangerouslySetInnerHTML={{ __html: jsontohtml(editorState) }}
            ></div>
         </div>
      </div>
   );
};

export default BlogPage;
