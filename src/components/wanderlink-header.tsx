import React from 'react';
import Link from 'next/link';

const Logo = () => (
  <svg
    width="320"
    height="130"
    viewBox="0 0 320 130"
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-auto text-primary"
  >
    <defs>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap');
          .logo-font { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 60px; fill: currentColor; }
        `}
      </style>
    </defs>
    
    <g transform="translate(0, 20)">
      <text x="5" y="60" className="logo-font">W</text>
      
      {/* Backpack Icon replacing 'a' */}
      <g transform="translate(68, 18)" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="44" height="54" rx="10" />
        <line x1="3" y1="25" x2="47" y2="25" />
        <path d="M20 3 V -4 H 30 V 3" strokeWidth="5"/>
      </g>
      
      <text x="125" y="60" className="logo-font">derLink</text>
    </g>

    {/* Globe */}
    <g transform="translate(180, 85)">
      <circle cx="12.5" cy="12.5" r="12.5" fill="currentColor" opacity="0.8" />
      <path 
        d="M12.5,0 A12.5,12.5 0 0,1 12.5,25 M12.5,0 A12.5,12.5 0 0,0 12.5,25 M2.5,12.5 H 22.5" 
        fill="none" 
        stroke="hsl(var(--background))"
        strokeWidth="1.5"
      />
       <ellipse cx="12.5" cy="12.5" rx="6" ry="12" fill="none" stroke="hsl(var(--background))" strokeWidth="1.5" />
    </g>

    {/* Island and Palm Tree */}
    <g transform="translate(220, 88)" fill="currentColor" opacity="0.8">
        <path d="M0,15 C10,12, 25,12, 35,15 L35,18 L0,18 Z" />
        <g transform="translate(20, -5)">
            <path d="M0,20 C-5,5, 10,5, 5,20" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M3,5 C5,7 10,9 14,10" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M-2,3 C-5,5 -8,8 -10,12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M-10,3 C-5,5 0,8 3,12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
    </g>
  </svg>
);


const WanderlinkHeader = () => {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
        </Link>
      </div>
    </header>
  );
};

export default WanderlinkHeader;
