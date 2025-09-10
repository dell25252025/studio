
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Plane } from 'lucide-react';

const Logo = () => (
  <svg 
    viewBox="0 0 200 50" 
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
            font-size: 32px;
            fill: hsl(var(--primary));
          }
        `}
      </style>
    </defs>
    <Plane className="text-primary" x="0" y="10" width="30" height="30" strokeWidth="2" />
    <text x="40" y="38" className="logo-text">WanderLink</text>
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
