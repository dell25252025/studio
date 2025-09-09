
'use client';

import { useEffect, useState } from 'react';
import { Compass, Bell, MessageSquare, User, UserPlus, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { getUserProfile } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const BottomNav = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.profilePictures && profile.profilePictures.length > 0) {
            setProfilePicture(profile.profilePictures[0]);
          } else {
            setProfilePicture(null);
          }
        } catch (error) {
          console.error("Failed to fetch user profile for nav:", error);
          setProfilePicture(null);
        }
      } else {
        setProfilePicture(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { icon: Compass, label: 'Discover', href: '/', active: true },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: MessageSquare, label: 'Messages', href: '#' },
    { icon: XCircle, label: 'Block', href: '#' },
  ];
  
  const getProfileContent = () => {
    if (currentUser) {
      if (profilePicture) {
        return (
          <Avatar className="h-12 w-12 border-4 border-background group-hover:border-secondary transition-colors">
            <AvatarImage src={profilePicture} alt="User profile picture" className="object-cover" />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        );
      }
      return <User className="h-8 w-8 mx-auto" />;
    }
    return <UserPlus className="h-8 w-8 mx-auto" />;
  };
  
  const profileHref = currentUser ? `/profile?id=${currentUser.uid}` : '/signup';
  const isUserLoggedIn = !!currentUser;

  return (
    <div className="fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <nav className="h-16 w-full rounded-full border bg-background/90 p-2 shadow-lg backdrop-blur-md">
        <div className="grid h-full grid-cols-5 items-center font-medium">
          {/* Left Items */}
          {navItems.slice(0, 2).map((item) => (
            <Link href={item.href} key={item.label} passHref>
              <Button
                asChild
                variant="ghost"
                className={`inline-flex h-full w-full flex-col items-center justify-center rounded-full px-2 ${
                  item.active ? 'text-primary' : 'text-muted-foreground'
                } hover:bg-secondary/50`}
              >
                <div>
                  <item.icon className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] font-body">{item.label}</span>
                </div>
              </Button>
            </Link>
          ))}

          {/* Central Profile Button */}
          <div className="relative -mt-10 flex h-full items-start justify-center">
            <Link href={profileHref} passHref className="group">
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90 ${!isUserLoggedIn ? 'animate-pulse-slow' : ''}`}
              >
                {getProfileContent()}
              </div>
            </Link>
          </div>

          {/* Right Items */}
          {navItems.slice(2, 4).map((item) => (
            <Link href={item.href} key={item.label} passHref>
              <Button
                asChild
                variant="ghost"
                className={`inline-flex h-full w-full flex-col items-center justify-center rounded-full px-2 ${
                  item.active ? 'text-primary' : 'text-muted-foreground'
                } hover:bg-secondary/50`}
              >
                <div>
                  <item.icon className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] font-body">{item.label}</span>
                </div>
              </Button>
            </Link>
          ))}

        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
