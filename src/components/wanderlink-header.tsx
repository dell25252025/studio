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
    
    <g fill="url(#logoGradient)">
      {/* <!-- Text: WanderLink --> */}
      <text 
        x="0" 
        y="35" 
        fontFamily="Arial, sans-serif" 
        fontSize="28" 
        fontWeight="bold"
        fill="currentColor"
      >
        WanderLink
      </text>

      {/* <!-- Airplane --> */}
      <path 
        d="M185,15 a5,5 0 0,1 0,10 l-20,0 l-10,15 l-5,-15 l5,-15 l10,15 l20,0 a5,5 0 0,1 0,-10"
        transform="rotate(20 175 25) translate(5 -2)"
      >
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0 0; 5 -2; 0 0" 
          dur="3s" 
          repeatCount="indefinite"
        />
      </path>

      {/* <!-- Icons below text --> */}
      <g transform="translate(135, 40)">
        {/* <!-- Suitcase --> */}
        <rect x="0" y="0" width="12" height="8" rx="2" ry="2" fill="currentColor" />
        <rect x="4" y="-2" width="4" height="2" fill="currentColor" />
        <line x1="6" y1="0" x2="6" y2="8" stroke="hsl(var(--background))" strokeWidth="0.5" />
        
        {/* <!-- Palm Tree --> */}
        <g transform="translate(18, -2)">
          <path d="M0,10 Q2,5 5,0 Q8,5 10,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5,0 L5,10" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2,4 L8,4" stroke="currentColor" strokeWidth="1.2" />
        </g>
        
        {/* <!-- Globe (simple) --> */}
         <circle cx="40" cy="4" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
         <path d="M35,4 a5,5 0 0,1 10,0" fill="none" stroke="currentColor" strokeWidth="1" />
         <path d="M40, -1 V9" fill="none" stroke="currentColor" strokeWidth="1" />
      </g>
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
