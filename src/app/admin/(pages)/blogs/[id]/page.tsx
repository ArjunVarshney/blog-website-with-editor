'use client';

import { useState } from 'react';
import { SerializedEditorState } from 'lexical';

import { Editor } from '@/components/blocks/editor-x/editor';
import { ChevronLeft } from 'lucide-react';
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tag, TagInput } from 'emblor';
import { editorState } from '@/helpers/test-editor-state';

export const initialValue = editorState;

export default function EditorPage() {
   const [editorState, setEditorState] =
      useState<SerializedEditorState>(initialValue);
   console.log(editorState);
   const [tags, setTags] = useState<Tag[]>([]);
   const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
   return (
      <div className='relative w-full overflow-hidden'>
         <Editor
            editorSerializedState={editorState}
            onSerializedChange={(value) => setEditorState(value)}
         />
         <Sheet>
            <SheetTrigger asChild>
               <div className='bg-background p-2 flex items-center justify-center absolute top-24 right-0 w-12 h-12 rounded-l-full border border-r-0'>
                  <ChevronLeft />
               </div>
            </SheetTrigger>
            <SheetContent>
               <SheetHeader>
                  <SheetTitle>Edit meta-data</SheetTitle>
                  <SheetDescription>
                     Make changes to the meta data of the blog here. Click save
                     when you&apos;re done.
                  </SheetDescription>
               </SheetHeader>
               <div className='grid flex-1 auto-rows-min gap-6 px-4'>
                  <div className='grid gap-3'>
                     <Label htmlFor='sheet-demo-name'>Title</Label>
                     <Input id='sheet-demo-name' defaultValue='Pedro Duarte' />
                  </div>
                  <div className='grid gap-3'>
                     <Label htmlFor='sheet-demo-name'>Tags</Label>
                     <TagInput
                        placeholder='Enter a topic'
                        tags={tags}
                        setTags={(newTags) => {
                           setTags(newTags);
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                        styleClasses={{
                           input: 'focus:outline-none px-1 shadow-none',
                           inlineTagsContainer:
                              'dark:bg-input/30 bg-transparent',
                        }}
                     />
                  </div>
                  <div className='grid gap-3'>
                     <Label htmlFor='sheet-demo-username'>Description</Label>
                     <Textarea
                        id='sheet-demo-username'
                        className='resize-none'
                        defaultValue=''
                     />
                  </div>
                  <div className='grid gap-3'>
                     <Label htmlFor='sheet-demo-username'>Slug</Label>
                     <Input id='sheet-demo-username' defaultValue='' />
                  </div>
               </div>
               <SheetFooter>
                  <Button type='submit'>Save changes</Button>
                  <SheetClose asChild>
                     <Button variant='outline'>Close</Button>
                  </SheetClose>
               </SheetFooter>
            </SheetContent>
         </Sheet>
      </div>
   );
}
