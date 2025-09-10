
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const WanderlinkHeader = ({ transparent = false }: { transparent?: boolean }) => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-10 transition-all duration-300"
      )}>
      <div className={cn(
        "flex h-full items-center justify-start",
        "container mx-auto px-4"
        )}>
        <Link href="/" className="flex items-center gap-2 group">
             <h1 className="text-xl font-bold font-logo bg-gradient-to-r from-gradient-start to-gradient-end text-transparent bg-clip-text">
              WanderLink
            </h1>
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
