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
      <linearGradient id="plane-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
      </linearGradient>
    </defs>

    {/* Text */}
    <text x="0" y="65" className="logo-text">travel</text>
    <text x="260" y="65" className="logo-text">me</text>
    
    {/* Stylized .w. with Plane */}
    <g transform="translate(155, 25) scale(1.2)">
       <path d="M22.5,12.96l-6.23-3.32L14.43,6,16,6.15,17.77,3.5,15.83,3.07,14.77,1,12.5,1.5l-1.9,4L8.35,5.15,6.5,7.5,8.27,8,6.43,11.32,4.5,11.75,2.23,9.5,0,10l1.9,4,2.25.35L6,18.07l-1.77.43L6.17,22l1.83.43L9.65,19.1l2.25.35,1.07,2.53,1.93-.43L13,18.75l3.32,1.83,1.83-1.83Z" fill="url(#plane-gradient)"/>
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
