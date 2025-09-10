
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Logo = () => (
  <svg 
    viewBox="0 0 220 50" 
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-auto md:h-9"
    aria-label="WanderLink Logo"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 32px;
            fill: hsl(var(--primary));
          }
          .logo-icon {
            stroke: hsl(var(--primary));
            stroke-width: 8;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
          }
        `}
      </style>
    </defs>
    <path className="logo-icon" d="M34.2,16.5c0,0-11.8,11.8-12.7,12.7c-1.9,1.9-5,1.9-7,0c-1.9-1.9-1.9-5,0-7c0.9-0.9,12.7-12.7,12.7-12.7s-1.3,10-0.4,11.9 C27.7,21.3,34.2,16.5,34.2,16.5z M25.3,25.3L12.5,38.1" />
    <text x="50" y="38" className="logo-text">WanderLink</text>
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
