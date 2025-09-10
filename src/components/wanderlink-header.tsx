
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="250" 
    height="60" 
    viewBox="0 0 250 60" 
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-auto md:h-10"
    aria-label="WanderLink Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 40px;
            fill: hsl(var(--primary));
          }
        `}
      </style>
    </defs>
    
    <text x="5" y="45" className="logo-text">W</text>
    
    <g transform="translate(45, 10)">
      <path d="M-5 10 C 20 -30, 40 0, 50 5" stroke="hsl(var(--primary))" fill="none" strokeWidth="5" strokeLinecap="round" />
      <path d="M 40 0 L 50 5 L 45 15 Z" fill="hsl(var(--primary))" />
    </g>
    
    <text x="50" y="45" className="logo-text">nderLink</text>

    <g transform="translate(130, 48)">
      <circle cx="10" cy="0" r="10" fill="hsl(var(--primary))" />
      <path d="M10 -8 Q 15 -8, 15 0 Q 15 8, 10 8 Q 5 8, 5 0 Q 5 -8, 10 -8 M 10 -8" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5"/>
      <path d="M 2 -2 L 18 2 M 2 2 L 18 -2" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.2"/>
      <line x1="10" y1="-10" x2="10" y2="10" stroke="hsl(var(--accent))" strokeWidth="1.2"/>
    </g>

    <g transform="translate(170, 35)">
      <path d="M -5,15 Q 15,18 35,15" fill="hsl(var(--primary))" opacity="0.2"/>
      <path d="M 15,15 C 12,5 25,0 25,0 C 25,0 38,5 35,15 C 30,12 20,12 15,15 Z" fill="hsl(var(--primary))"/>
      <path d="M 25,0 C 23, -5, 27,-5, 25,0" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--primary))" />
      <path d="M 10,12 C 5,5 15,-5 15,-5" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 40,12 C 45,5 35,-5 35,-5" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

const WanderlinkHeader = ({ transparent = false }: { transparent?: boolean }) => {
  return (
    <header className={cn(
        "fixed top-0 left-0 z-20 w-full h-16 transition-all duration-300",
        "bg-background/90 backdrop-blur-md border-b"
      )}>
      <div className={cn(
        "flex h-full items-center justify-center",
        "md:container md:mx-auto md:justify-start md:px-4"
        )}>
        <Link href="/" className="flex items-center gap-2 group">
            <Logo />
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
