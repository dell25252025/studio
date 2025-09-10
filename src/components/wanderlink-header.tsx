
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';

const Logo = () => (
  <svg 
    width="145" 
    height="40" 
    viewBox="0 0 145 40" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-6 w-auto md:h-8"
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
        "fixed top-0 left-0 z-20 w-full h-12 transition-all duration-300",
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
