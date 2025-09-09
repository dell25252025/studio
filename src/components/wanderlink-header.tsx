import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    width="250" 
    height="100" 
    viewBox="0 0 380 120" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-16 w-auto"
    aria-label="WanderLink Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap');
          .logo-text {
            font-family: 'Fredoka', sans-serif;
            font-weight: 700;
            font-size: 60px;
            fill: hsl(var(--primary));
          }
        `}
      </style>
    </defs>

    {/* Text Part */}
    <text x="5" y="70" className="logo-text">W</text>
    {/* The 'a' is replaced by a path */}
    <path d="M125.2,70.1c-14.9,0-23.4-9.3-23.4-22.3c0-13.4,8.8-22.6,23.5-22.6c14.6,0,23.2,9.3,23.2,22.6 C148.4,60.8,139.9,70.1,125.2,70.1z M125.2,30.5c-7.8,0-12,5.7-12,17.2c0,11.5,4.3,17.2,12,17.2c7.7,0,11.8-5.7,11.8-17.2 C137.1,36.2,132.9,30.5,125.2,30.5z" fill="hsl(var(--primary))" />
    <text x="145" y="70" className="logo-text">nderLink</text>

    {/* Airplane and Swoosh */}
    <g fill="hsl(var(--primary))">
        <path d="M124,25.6c1.1-1.3,2.4-2.4,3.8-3.3c14.3-9,33.5-3.8,42,10.2l0.8,1.3l1.8-1.5 c1.3-1.1,3-1.2,4.4-0.3l5.5,3.6c1.4,0.9,2,2.7,1.4,4.2l-2.4,5.9c-0.6,1.5-2.2,2.3-3.8,1.9l-6-1.5c-1.6-0.4-2.7-1.8-2.7-3.4 l0-2.3l-2.5,2.1c-9.1,7.6-21.2,8.8-31.5,3.2c-1.6-0.9-2.8-2.1-3.8-3.5C118.8,37.8,119,29.9,124,25.6z" />
        <path d="M129.5,23.5c-4.3-1.6-9-1.9-13.5-0.8c-10.4,2.5-17.9,11.5-18.4,22.2c-0.1,2.6,0.5,5.2,1.5,7.5 c-3.3-8.8,0.3-19,8.4-24.9C115.8,22.1,122.9,20.5,129.5,23.5z" opacity="0.7"/>
    </g>

    {/* Globe */}
    <g transform="translate(240, 80)" fill="hsl(var(--primary))">
      <circle cx="0" cy="0" r="15" />
      <path d="M-13,0 a15,15 0 0,1 26,0 a15,15 0 0,1 -26,0 M-7,-12 a15,15 0 0,1 0,24 M7,-12 a15,15 0 0,1 0,24" fill="none" stroke="hsl(var(--background))" stroke-width="1.5" opacity="0.5" />
      <path d="M-1, -14.9C-1, -14.9 5, -10 5, 0S-1, 14.9 -1, 14.9 M-5, -12C-5, -12 0, -8 0, 0S-5, 12 -5, 12 M-10, -7C-10, -7 -5, -4 -5, 0S-10, 7 -10, 7" fill="none" stroke="hsl(var(--background))" stroke-width="1.5" opacity="0.5"/>
    </g>

    {/* Island and Palm Tree */}
    <g transform="translate(290, 83)" fill="hsl(var(--primary))">
      <path d="M-15,12 C 5,2, 25,2, 45,12 L45,17 L-15,17 Z" />
      <path d="M15,12 C 15,12 15,-5 20, -15 C 25,-5 25,12 25,12 M15,12 C 15,12 5,-5 0,-10 C 5,-5 10,12 10,12 M15,12 C 15,12 25,-5 30,-10 C 25,-5 20,12 20,12" stroke="hsl(var(--primary))" stroke-width="3" fill="none" stroke-linecap="round" />
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
