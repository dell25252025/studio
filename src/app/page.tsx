
'use client';

import { Suspense, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleAiMatching, getAllUsers, getUserProfile } from '@/app/actions';
import AiMatchResults from '@/components/ai-match-results';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { useToast } from '@/hooks/use-toast';
import type { DocumentData } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import MatchCarousel from '@/components/match-carousel';


// --- Sub-component for Authenticated Users --- //

function DiscoverPage({ user }: { user: User }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('discover');
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
      
      setDisplayMatches(filtered);
    };

    if (possibleMatches.length > 0) {
      if (searchParams.toString()) {
        filterMatches();
      } else {
        setDisplayMatches(possibleMatches);
      }
    }
  }, [searchParams, possibleMatches]);


  const runAiMatching = async () => {
    if (!currentUserProfile) {
       toast({ variant: 'destructive', title: 'User profile not loaded' });
       return;
    }
    setLoading(true);
    setView('results');
    try {
      // Map Firestore data to the format expected by the AI flow
      const mappedUserProfile = {
          travelStyle: currentUserProfile.travelStyle || '',
          dreamDestinations: [currentUserProfile.destination] || [],
          languagesSpoken: currentUserProfile.languages || [],
          travelIntention: currentUserProfile.intention || '50/50',
          interests: [currentUserProfile.activities] || [],
          age: currentUserProfile.age || 18,
          sex: currentUserProfile.sex || 'Homme',
          verified: true, // Assuming current user is always verified for this
      };

      const mappedPossibleMatches = displayMatches.map(p => ({
          travelStyle: p.travelStyle || '',
          dreamDestinations: [p.destination] || [],
          languagesSpoken: p.languages || [],
          travelIntention: p.intention || '50/50',
          interests: [p.activities] || [],
          age: p.age || 18,
          sex: p.sex || 'Homme',
          verified: true,
      }));

      const res = await handleAiMatching({ userProfile: mappedUserProfile, possibleMatches: mappedPossibleMatches });
      setResults(res);
    } catch (error) {
      console.error("Failed to get AI matches:", error);
      toast({ variant: 'destructive', title: 'AI Matching Error' });
    } finally {
      setLoading(false);
    }
  };

  const resetView = () => {
    setView('discover');
    setResults([]);
  };

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
        interests: [p.activities] || ['Toutes'],
        verified: true,
        image: p.profilePictures?.[0] || 'https://picsum.photos/800/1200'
    }));
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <WanderlinkHeader />
      <main className="flex-1 pb-24 pt-16">
        <div className="container mx-auto max-w-7xl px-2">
          <div className="text-center">
            {profilesLoading ? (
              <div className="flex flex-col items-center justify-center text-center h-96">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="mt-6 text-2xl font-semibold">Loading profiles...</h2>
              </div>
            ) : view === 'discover' ? (
              <>
                <div>
                  {displayMatches.length > 0 ? (
                    <MatchCarousel profiles={getMappedProfiles(displayMatches)} />
                  ) : (
                    <p className="text-muted-foreground mt-8">No profiles match your criteria.</p>
                  )}
                </div>
              </>
            ) : null}

            {view === 'results' && loading && (
              <div className="flex flex-col items-center justify-center text-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <h2 className="mt-6 text-2xl font-semibold">Finding your perfect match...</h2>
                  <p className="mt-2 text-muted-foreground">Our AI is analyzing profiles to find the best travel partners for you.</p>
              </div>
            )}

            {view === 'results' && !loading && results.length > 0 && (
              <AiMatchResults results={results} profiles={getMappedProfiles(displayMatches)} onReset={resetView} />
            )}
             {view === 'results' && !loading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center h-96">
                    <h2 className="mt-6 text-2xl font-semibold">No AI matches found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your filters or check back later.</p>
                    <Button onClick={resetView} className="mt-4">Back to Discover</Button>
                </div>
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

  // If not logged in, redirect to login page
  if (typeof window !== 'undefined') {
    router.push('/login');
  }

  return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
  );
}

export default ConditionalHome;
