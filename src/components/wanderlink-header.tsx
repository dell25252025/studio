
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface WanderlinkHeaderProps {
  onFilterClick: () => void;
}

const WanderlinkHeader = ({ onFilterClick }: WanderlinkHeaderProps) => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-12 transition-all duration-300",
        "bg-background/90 backdrop-blur-sm"
      )}>
      <div className={cn(
        "flex h-full items-center justify-between",
        "px-2"
        )}>
        <div className="w-8"></div>
        <Link href="/" className="flex items-center gap-2 group">
             <h1 className="text-xl font-bold font-logo bg-gradient-to-r from-gradient-start to-gradient-end text-transparent bg-clip-text">
              WanderLink
            </h1>
        </Link>
        <Button variant="ghost" size="icon" onClick={onFilterClick}>
          <SlidersHorizontal className="h-5 w-5" />
          <span className="sr-only">Filters</span>
        </Button>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
