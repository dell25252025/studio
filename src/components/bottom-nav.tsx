
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Compass, Bell, MessageSquare, User, UserPlus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { getUserProfile } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const pathname = usePathname();

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
  
   const isDiscoverActive = pathname === '/' || pathname.startsWith('/discover');
   const areMessagesActive = pathname.startsWith('/chat');
   const areSettingsActive = pathname.startsWith('/settings');

  const navItems = [
    { icon: Compass, label: 'Discover', href: '/discover', active: isDiscoverActive },
    { icon: Bell, label: 'Notifications', href: '#', active: false },
    { icon: MessageSquare, label: 'Messages', href: '/chat', active: areMessagesActive },
    { icon: Settings, label: 'Paramètres', href: '/settings', active: areSettingsActive },
  ];
  
  const getProfileContent = () => {
    if (currentUser) {
      if (profilePicture) {
        return (
          <Avatar className="h-10 w-10 border-2 border-background group-hover:border-secondary transition-colors">
            <AvatarImage src={profilePicture} alt="User profile picture" className="object-cover" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        );
      }
      return <User className="h-6 w-6 mx-auto" />;
    }
    return <UserPlus className="h-6 w-6 mx-auto" />;
  };
  
  const profileHref = currentUser ? `/profile?id=${currentUser.uid}` : '/login';
  const isProfileActive = currentUser ? pathname === `/profile` && new URLSearchParams(window.location.search).get('id') === currentUser.uid : false;
  const isUserLoggedIn = !!currentUser;

  return (
    <div className="fixed bottom-2 left-1/2 z-20 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 md:bottom-4 md:w-[calc(100%-2rem)]">
      <nav className="h-14 w-full rounded-full border bg-background/90 p-1 shadow-lg backdrop-blur-md md:h-16 md:p-2">
        <div className="grid h-full grid-cols-5 items-center font-medium">
          {/* Left Items */}
          {navItems.slice(0, 2).map((item) => (
            <Link href={item.href} key={item.label} passHref>
              <Button
                asChild
                variant="ghost"
                className={cn(`inline-flex h-full w-full flex-col items-center justify-center rounded-full px-1 md:px-2 hover:bg-secondary/50`,
                  item.active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div>
                  <item.icon className="h-5 w-5 mb-0.5" />
                  <span className="text-[10px] font-body">{item.label}</span>
                </div>
              </Button>
            </Link>
          ))}

          {/* Central Profile Button */}
          <div className="relative -mt-8 flex h-full items-start justify-center">
            <Link href={profileHref} passHref className="group">
              <div
                className={cn(`inline-flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90 md:h-14 md:w-14`,
                 isProfileActive ? 'bg-accent' : 'bg-primary',
                 !isUserLoggedIn ? 'animate-pulse-slow' : ''
                )}
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
                className={cn(`inline-flex h-full w-full flex-col items-center justify-center rounded-full px-1 md:px-2 hover:bg-secondary/50`,
                  item.active ? 'text-primary' : 'text-muted-foreground'
                )}
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
