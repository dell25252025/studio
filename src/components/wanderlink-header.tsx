
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const WanderlinkHeader = () => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-10 md:h-12 transition-all duration-300",
        "bg-background/90 backdrop-blur-sm border-b"
      )}>
      <div className={cn(
        "flex items-center justify-between h-full",
        "px-2 md:px-4"
        )}>
        <Link href="/" className="flex items-center gap-2 group">
             <h1 className="text-xl md:text-2xl font-bold font-logo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WanderLink
            </h1>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/notifications" passHref>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-transparent hover:text-muted-foreground">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
