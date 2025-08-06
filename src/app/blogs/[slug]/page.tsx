import { editorState } from "@/helpers/test-editor-state";
import React from "react";

type Props = {};

const BlogPage = (props: Props) => {
   return (
      <div className="flex gap-1 bg-primary h-screen">
         <div className="w-full bg-background max-h-screen overflow-y-scroll">
            Try to make the output here.
         </div>
         <div className="w-full bg-background overflow-x-hidden overflow-y-scroll">
            <pre className="max-w-full">
               {JSON.stringify(editorState, null, 3)}
            </pre>
         </div>
      </div>
   );
};

export default BlogPage;
