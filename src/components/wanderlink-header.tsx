
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

interface WanderlinkHeaderProps {
  transparent?: boolean;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

const WanderlinkHeader = ({ transparent = false, showFilter = false, onFilterClick }: WanderlinkHeaderProps) => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-10 transition-all duration-300",
        !transparent && "bg-background/90 backdrop-blur-sm"
      )}>
      <div className={cn(
        "flex h-full items-center justify-between",
        "px-2"
        )}>
        <Link href="/" className="flex items-center gap-2 group">
             <h1 className="text-xl font-bold font-logo bg-gradient-to-r from-gradient-start to-gradient-end text-transparent bg-clip-text">
              WanderLink
            </h1>
        </Link>
         {showFilter && (
          <Button variant="ghost" size="icon" onClick={onFilterClick} className="h-8 w-8">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="sr-only">Filtre</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default WanderlinkHeader;
