
'use client';

import { useEffect, useState } from 'react';
import { Compass, Heart, MessageSquare, User, UserPlus, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

const BottomNav = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { icon: Compass, label: 'Discover', href: '/', active: true },
    { icon: Heart, label: 'Matches', href: '#' },
    // Placeholder for the central button
    { icon: 'placeholder', label: 'Profile', href: '#' }, 
    { icon: MessageSquare, label: 'Messages', href: '#' },
    { icon: XCircle, label: 'Block', href: '#' },
  ];
  
  const profileItem = currentUser
    ? { icon: User, label: 'Profile', href: `/profile?id=${currentUser.uid}`, animated: false }
    : { icon: UserPlus, label: 'Profile', href: '/signup', animated: true };


  return (
    <nav className="fixed bottom-0 left-0 z-20 h-20 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item, index) => {
          if (index === 2) {
            // Central Profile Button
            return (
              <div key="profile-button-container" className="relative flex items-center justify-center">
                <div className="absolute -top-8 flex items-center justify-center">
                   <Link href={profileItem.href} passHref>
                      <Button
                        asChild
                        variant="ghost"
                        className="inline-flex h-20 w-20 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                      >
                        <div className={profileItem.animated ? 'animate-pulse-slow' : ''}>
                          <profileItem.icon className="h-10 w-10 mx-auto" />
                        </div>
                      </Button>
                  </Link>
                </div>
              </div>
            );
          }
          
          return (
            <Link href={item.href} key={item.label} passHref>
              <Button
                asChild
                variant="ghost"
                className={`inline-flex h-full w-full flex-col items-center justify-center px-5 rounded-none ${
                  item.active ? 'text-primary' : 'text-muted-foreground'
                } hover:bg-secondary/50`}
              >
                <div>
                  <item.icon className="h-6 w-6 mb-1 mx-auto" />
                  <span className="text-xs font-body">{item.label}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
