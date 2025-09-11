
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const WanderlinkHeader = () => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-6 transition-all duration-300",
        "bg-background/90 backdrop-blur-sm border-b"
      )}>
      <div className={cn(
        "flex items-center justify-start h-full",
        "px-4" 
        )}>
        <Link href="/" className="flex items-center gap-2 group">
             <h1 className="text-xl font-bold font-logo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WanderLink
            </h1>
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
