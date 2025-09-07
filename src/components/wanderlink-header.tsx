import React from 'react';
import { Plane } from 'lucide-react';

const WanderlinkHeader = () => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Plane className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            WanderLink
          </h1>
        </div>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
