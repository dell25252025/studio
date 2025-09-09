import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="200" 
    height="50" 
    viewBox="0 0 200 50" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-12 w-auto text-primary"
    aria-label="WanderLink Logo"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    
    {/* Text part of the logo */}
    <text 
      x="0" 
      y="30" 
      fontFamily="Arial, sans-serif" 
      fontSize="24" 
      fontWeight="bold"
      fill="currentColor"
    >
      WanderLin
    </text>

    {/* Stylized 'k' as a diamond */}
    <path d="M125 15 L135 27.5 L125 40 L115 27.5 Z" fill="url(#logoGradient)" />
    
    {/* Pink dot */}
    <circle cx="145" cy="15" r="4" fill="hsl(var(--accent))" />

    {/* Icons below the logo */}
    <g transform="translate(110, 38)" fill="currentColor">
      {/* Suitcase Icon */}
      <path d="M0,0 h10 v7 h-10 z M3,-2 v2 h4 v-2 z" transform="translate(0, 0) scale(0.8)" />
      
      {/* Tent/Tripod Icon */}
      <path d="M15,7 l-4,-7 l-4,7 h8 z M11,7 v-4" transform="translate(0, 0) scale(0.8)" />

      {/* Globe Icon */}
      <circle cx="30" cy="3.5" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="26" y1="3.5" x2="34" y2="3.5" stroke="currentColor" strokeWidth="0.8" />
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
