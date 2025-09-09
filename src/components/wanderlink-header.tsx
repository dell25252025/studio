import React from 'react';
import Link from 'next/link';

const Logo = () => (
  <svg
    width="240"
    height="100"
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
      <g transform="translate(70, 20)">
        <path d="M15,5 C10,5 5,10 5,15 L5,45 C5,50 10,55 15,55 L35,55 C40,55 45,50 45,45 L45,15 C45,10 40,5 35,5 Z M25,2.5 L25,10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M15,25 L35,25" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M38,12 L48,18 C50,19 50,21 48,22 L38,28" fill="currentColor" />
      </g>
      
      <text x="125" y="60" className="logo-font">derLink</text>
    </g>

    {/* Globe */}
    <g transform="translate(180, 85)">
      <circle cx="12.5" cy="12.5" r="12.5" fill="currentColor" opacity="0.8" />
      <path 
        d="M12.5,0 A12.5,12.5 0 0,1 12.5,25 M12.5,0 A12.5,12.5 0 0,0 12.5,25 M0,12.5 A12.5,12.5 0 0,0 25,12.5 M0,12.5 A12.5,12.5 0 0,1 25,12.5" 
        fill="none" 
        stroke="hsl(var(--background))"
        strokeWidth="0.8"
      />
      <path 
        d="M5,10 a10,8 0 0,1 15,0 M7,15 a8,5 0 0,0 11,0"
        fill="none" 
        stroke="hsl(var(--background))"
        strokeWidth="0.8"
      />
    </g>

    {/* Island and Palm Tree */}
    <g transform="translate(220, 88)">
      <path d="M0,15 C20,10, 40,10, 60,15 L60,18 L0,18 Z" fill="currentColor" opacity="0.8" />
      <path d="M45,15 C40,-5 20,-5 25,15" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42,2 C45,5 48,8 52,10" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M40,0 C35,5 30,8 28,12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
      <path d="M30,0 C35,5 40,8 42,12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
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
