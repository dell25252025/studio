import React from 'react';
import { Plane, Luggage } from 'lucide-react';
import Link from 'next/link';

const WanderlinkHeader = () => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Plane className="h-7 w-7 text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end transition-transform duration-300 group-hover:rotate-[-15deg]" />
          <h1 className="text-2xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end flex items-center">
            WanderLi<Luggage className="inline-block h-6 w-6 -mb-1" />k
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
