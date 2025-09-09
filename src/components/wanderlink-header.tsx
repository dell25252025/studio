import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="300" 
    height="100" 
    viewBox="0 0 350 100" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-14 w-auto"
    aria-label="travel.w.me Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 50px;
            fill: hsl(var(--foreground));
          }
        `}
      </style>
      <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
      </linearGradient>
    </defs>

    {/* Text */}
    <text x="0" y="65" className="logo-text">travel</text>
    <text x="260" y="65" className="logo-text">me</text>
    
    {/* Stylized .w. */}
    <g transform="translate(145, 18)">
      {/* Sun */}
      <circle cx="27.5" cy="27.5" r="10" fill="url(#sun-gradient)" />
      {/* Mountains (w) */}
      <path d="M 0 50 L 15 30 L 27.5 45 L 40 30 L 55 50" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>

    {/* Dots */}
    <circle cx="130" cy="60" r="3.5" fill="hsl(var(--foreground))" />
    <circle cx="245" cy="60" r="3.5" fill="hsl(var(--foreground))" />
  </svg>
);


const WanderlinkHeader = ({ transparent = false }: { transparent?: boolean }) => {
  return (
    <header className={cn(
        "absolute top-0 z-20 w-full",
        !transparent && "sticky border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
