'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const WIDGET_SCRIPT_URL = 'https://platform.twitter.com/widgets.js';

type Props = {
   tweetID: string;
};

let isTwitterScriptLoading = true;

const Tweet = ({ tweetID }: Props) => {
   const containerRef = useRef<HTMLDivElement | null>(null);

   const previousTweetIDRef = useRef<string>('');
   const [isTweetLoading, setIsTweetLoading] = useState(false);

   const createTweet = useCallback(async () => {
      try {
         // @ts-expect-error Twitter is attached to the window.
         await window.twttr.widgets.createTweet(tweetID, containerRef.current);

         setIsTweetLoading(false);
         isTwitterScriptLoading = false;
      } catch (error) {
         console.log(error);
      }
   }, [tweetID]);

   useEffect(() => {
      if (tweetID !== previousTweetIDRef.current) {
         setIsTweetLoading(true);

         if (isTwitterScriptLoading) {
            const script = document.createElement('script');
            script.src = WIDGET_SCRIPT_URL;
            script.async = true;
            document.body?.appendChild(script);
            script.onload = createTweet;
         } else {
            createTweet();
         }

         if (previousTweetIDRef) {
            previousTweetIDRef.current = tweetID;
         }
      }
   }, [createTweet, tweetID]);

   return (
      <>
         {isTweetLoading ? 'loading' : null}
         <div
            style={{ display: 'inline-block', width: '550px' }}
            ref={containerRef}
         />
      </>
   );
};

export default Tweet;
