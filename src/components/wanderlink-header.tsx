import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="280" 
    height="60" 
    viewBox="0 0 280 60" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-10 w-auto"
    aria-label="travel.w.me Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 48px;
            fill: hsl(var(--foreground));
          }
        `}
      </style>
    </defs>
    
    <text x="0" y="45" className="logo-text">travel</text>
    <text x="188" y="45" className="logo-text">.me</text>
    
    <g transform="translate(158, 23) scale(1.4)">
        <path d="M 10 0 L 12 8 L 10 10 L 8 8 Z" fill="hsl(var(--accent))" />
        <path d="M 20 10 L 12 12 L 10 10 L 12 8 Z" fill="hsl(var(--accent))" opacity="0.7"/>
        <path d="M 10 20 L 8 12 L 10 10 L 12 12 Z" fill="hsl(var(--primary))" />
        <path d="M 0 10 L 8 12 L 10 10 L 8 8 Z" fill="hsl(var(--primary))" opacity="0.7"/>
    </g>
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
