'use client';

import { Suspense, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getAllUsers, getUserProfile } from '@/app/actions';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { useToast } from '@/hooks/use-toast';
import type { DocumentData } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import ProfileCard from '@/components/profile-card';


// --- Sub-component for Authenticated Users --- //

function DiscoverPage({ user }: { user: User }) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [currentUserProfile, setCurrentUserProfile] = useState<DocumentData | null>(null);
  const [possibleMatches, setPossibleMatches] = useState<DocumentData[]>([]);
  const [displayMatches, setDisplayMatches] = useState<DocumentData[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setProfilesLoading(true);
        const [userProfile, allUsers] = await Promise.all([
          getUserProfile(user.uid),
          getAllUsers(),
        ]);
        setCurrentUserProfile(userProfile);
        const otherUsers = allUsers.filter(u => u.id !== user.uid);
        setPossibleMatches(otherUsers);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        toast({ variant: 'destructive', title: 'Error fetching profiles' });
      } finally {
        setProfilesLoading(false);
      }
    }
    fetchProfiles();
  }, [user, toast]);

  useEffect(() => {
    const filterMatches = () => {
      let filtered = [...possibleMatches];

      const hasUrlFilters = searchParams.toString().length > 0;
      
      if (hasUrlFilters) {
          const showMe = searchParams.get('showMe');
          if (showMe) {
            filtered = filtered.filter(p => p.sex === showMe);
          }
          
          const minAge = searchParams.get('minAge');
          if (minAge) {
            filtered = filtered.filter(p => p.age >= parseInt(minAge));
          }

          const maxAge = searchParams.get('maxAge');
          if (maxAge) {
            filtered = filtered.filter(p => p.age <= parseInt(maxAge));
          }

          const destination = searchParams.get('destination');
          if (destination && destination !== 'Toutes') {
            filtered = filtered.filter(p => p.destination === destination);
          }

          const intention = searchParams.get('intention');
          if (intention && intention !== 'Toutes') {
            filtered = filtered.filter(p => p.intention === intention);
          }
          
          const travelStyle = searchParams.get('travelStyle');
          if (travelStyle && travelStyle !== 'Tous') {
            filtered = filtered.filter(p => p.travelStyle === travelStyle);
          }

          const activities = searchParams.get('activities');
          if (activities && activities !== 'Toutes') {
            filtered = filtered.filter(p => p.activities === activities);
          }
      } else if (currentUserProfile) {
         // Apply default filter if no URL params
         let defaultShowMe = 'Femme';
         if (currentUserProfile.sex === 'Femme') {
           defaultShowMe = 'Homme';
         } else if (currentUserProfile.sex === 'Autre') {
           defaultShowMe = 'Autre';
         }
         filtered = filtered.filter(p => p.sex === defaultShowMe);
      }
      
      setDisplayMatches(filtered);
    };

    if (possibleMatches.length > 0) {
        filterMatches();
    }
  }, [searchParams, possibleMatches, currentUserProfile]);


  const getMappedProfiles = (profiles: DocumentData[]): UserProfile[] => {
      return profiles.map(p => ({
        id: p.id,
        name: p.firstName,
        age: p.age,
        sex: p.sex,
        bio: p.bio,
        location: p.location || 'N/A',
        travelStyle: p.travelStyle || 'Tous',
        dreamDestinations: [p.destination] || ['Toutes'],
        languagesSpoken: p.languages || [],
        travelIntention: p.intention || 'Toutes',
        verified: true,
        image: p.profilePictures?.[0] || 'https://picsum.photos/800/1200'
    }));
  }

  const mappedProfiles = getMappedProfiles(displayMatches);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <WanderlinkHeader />
      <main className="flex-1 pb-24 pt-12">
        <div className="container mx-auto max-w-7xl px-2">
          <div className="text-center">
            {profilesLoading ? (
              <div className="flex flex-col items-center justify-center text-center h-96">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="mt-6 text-2xl font-semibold">Loading profiles...</h2>
              </div>
            ) : (
              <>
                
                <div className="mt-2">
                   {displayMatches.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                      {mappedProfiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-8">No profiles match your criteria.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}


// --- Main Component --- //

function ConditionalHome() {
  const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserAuth(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect only when authentication check is complete and user is not logged in.
    if (!loadingAuth && !currentUserAuth) {
      router.push('/login');
    }
  }, [loadingAuth, currentUserAuth, router]);

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUserAuth) {
    return (
      <Suspense fallback={<div className="flex h-screen w-full flex-col items-center justify-center bg-background"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <DiscoverPage user={currentUserAuth} />
      </Suspense>
    );
  }
  
  // Return a loader while redirecting to prevent rendering anything else
  return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
  );
}

export default ConditionalHome;
