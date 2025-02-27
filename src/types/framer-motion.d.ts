declare module 'framer-motion' {
  import * as React from 'react';

  // Basic types for AnimatePresence and motion components
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    initial?: boolean;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
  }>;

  export const motion: {
    [key: string]: any;
    div: any;
    span: any;
    img: any;
    button: any;
  };

  // Basic animation types
  export type Variant = {
    [key: string]: any;
  };

  export type Variants = {
    [key: string]: Variant;
  };

  export type AnimationControls = {
    start: (definition: any) => Promise<any>;
    stop: () => void;
    set: (definition: any) => void;
  };

  export function useAnimation(): AnimationControls;
} 