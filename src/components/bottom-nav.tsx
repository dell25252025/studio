
'use client';

import { useEffect, useState } from 'react';
import { Compass, Heart, MessageSquare, User, UserPlus, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import { getUserProfile } from '@/app/actions';
import Image from 'next/image';
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
    { icon: Heart, label: 'Matches', href: '#' },
    { icon: 'placeholder', label: 'Profile', href: '#' }, 
    { icon: MessageSquare, label: 'Messages', href: '#' },
    { icon: XCircle, label: 'Block', href: '#' },
  ];
  
  const getProfileContent = () => {
    if (currentUser) {
      if (profilePicture) {
        return (
          <Avatar className="h-16 w-16 border-4 border-background group-hover:border-secondary transition-colors">
            <AvatarImage src={profilePicture} alt="User profile picture" className="object-cover" />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
        );
      }
      return <User className="h-10 w-10 mx-auto" />;
    }
    return <UserPlus className="h-10 w-10 mx-auto" />;
  };
  
  const profileHref = currentUser ? `/profile?id=${currentUser.uid}` : '/signup';
  const isUserLoggedIn = !!currentUser;


  return (
    <nav className="fixed bottom-0 left-0 z-20 h-20 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item, index) => {
          if (index === 2) {
            // Central Profile Button
            return (
              <div key="profile-button-container" className="relative flex items-center justify-center">
                <div className="absolute -top-8 flex items-center justify-center">
                   <Link href={profileHref} passHref className="group">
                      <Button
                        asChild
                        variant="ghost"
                        className="inline-flex h-20 w-20 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 ease-in-out"
                      >
                        <div className={!isUserLoggedIn ? 'animate-pulse-slow' : ''}>
                          {getProfileContent()}
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
