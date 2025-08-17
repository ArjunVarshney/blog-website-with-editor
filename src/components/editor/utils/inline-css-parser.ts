import type { CSSProperties } from 'react';

function camelCase(input: string) {
   return input.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export function parseInlineStyle(input: string): CSSProperties {
   return input.split(';').reduce((obj, kv) => {
      let [key, val] = kv.split(':');
      key = key?.trim();
      val = val?.trim();
      if (key && val) {
         obj[camelCase(key) as keyof CSSProperties] = val as any;
      }
      return obj;
   }, {} as CSSProperties);
}
