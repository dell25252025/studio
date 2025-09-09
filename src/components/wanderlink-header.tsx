import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="125" 
    height="40" 
    viewBox="0 0 125 40" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-auto"
    aria-label="travel.me Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            font-size: 28px;
            fill: hsl(var(--foreground));
          }
        `}
      </style>
    </defs>
    
    <text x="0" y="28" className="logo-text">travel</text>
    <g transform="translate(80, 14) scale(0.9)">
        <path d="M 10 0 L 12 8 L 10 10 L 8 8 Z" fill="hsl(var(--accent))" />
        <path d="M 20 10 L 12 12 L 10 10 L 12 8 Z" fill="hsl(var(--accent))" opacity="0.7"/>
        <path d="M 10 20 L 8 12 L 10 10 L 12 12 Z" fill="hsl(var(--primary))" />
        <path d="M 0 10 L 8 12 L 10 10 L 8 8 Z" fill="hsl(var(--primary))" opacity="0.7"/>
    </g>
    <text x="98" y="28" className="logo-text">me</text>
  </svg>
);


const WanderlinkHeader = ({ transparent = false }: { transparent?: boolean }) => {
  return (
    <header className={cn(
        "fixed top-0 z-20 w-full p-0 md:bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="md:flex md:h-16 md:items-center md:px-4">
        <div className="absolute top-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 md:static md:w-auto md:transform-none">
            <div className="h-16 w-full rounded-full border bg-background/90 p-2 shadow-lg backdrop-blur-md flex items-center justify-center md:shadow-none md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo />
                </Link>
            </div>
        </div>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
