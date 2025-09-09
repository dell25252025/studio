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
          .logo-font { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 50px; fill: currentColor; }
        `}
      </style>
    </defs>
    
    <g transform="translate(0, 20)">
      {/* Plane */}
      <path
        d="M105.3,16.8c-1.3-1.3-3.4-1.3-4.7,0l-12.5,12.5c-1.3,1.3-1.3,3.4,0,4.7s3.4,1.3,4.7,0l4.4-4.4l-4.9,4.9c-1.3,1.3-1.3,3.4,0,4.7c1.3,1.3,3.4,1.3,4.7,0l4.9-4.9l4.4,4.4c1.3,1.3,3.4,1.3,4.7,0c1.3-1.3,1.3-3.4,0-4.7L105.3,16.8z M102.8,25.9l-2.2-2.2l8.8-8.8l2.2,2.2L102.8,25.9z"
        fill="currentColor"
      />
      {/* Plane Trail from 'a' */}
      <path
        d="M93.5,52.5 C110,40, 120,25, 105,15"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <text x="5" y="60" className="logo-font">W</text>
      {/* Custom 'a' is just the trail, the letter is omitted */}
      <text x="85" y="60" className="logo-font">nderLink</text>
    </g>

    {/* Globe */}
    <g transform="translate(130, 85)">
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
    <g transform="translate(170, 88)">
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
