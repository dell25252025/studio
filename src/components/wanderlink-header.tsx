import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="200" 
    height="50" 
    viewBox="0 0 200 50" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-12 w-auto"
    aria-label="WanderLink Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    
    <text 
      x="0" 
      y="35" 
      fontFamily="'Helvetica Neue', Arial, sans-serif" 
      fontSize="28" 
      fontWeight="600"
      fill="hsl(var(--primary))"
    >
      WanderLin
    </text>

    <path d="M145 25 L155 35 L145 45 L135 35 Z" fill="url(#logoGradient)" />
    
    <circle cx="160" cy="20" r="4" fill="hsl(var(--accent))" />

    <g transform="translate(136, 46)" fill="hsl(var(--primary))" opacity="0.8">
      {/* Cloud Icon */}
      <path d="M3.5,0 C1.5,0 0,1.5 0,3.5 C0,5.5 1.5,7 3.5,7 H10.5 C12.5,7 14,5.5 14,3.5 C14,1.5 12.5,0 10.5,0 Z M3.5,1 C5,1 6,2.5 6,4 C6,5.5 5,7 3.5,7" transform="scale(0.6)" />
      
      {/* Globe Icon */}
      <circle cx="24" cy="0" r="4" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />
      <line x1="20" y1="0" x2="28" y2="0" stroke="hsl(var(--primary))" strokeWidth="0.8" />

    </g>
  </svg>
);


const WanderlinkHeader = ({ transparent = false }: { transparent?: boolean }) => {
  return (
    <header className={cn(
        "sticky top-0 z-20 w-full",
        !transparent && "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
