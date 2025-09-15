
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AIPoweredMatchingInput } from '@/ai/flows/ai-powered-matching';
import { handleAiMatching } from '@/app/actions';
import { currentUser, possibleMatches } from '@/lib/mock-data';
import AiMatchResults from '@/components/ai-match-results';
import MatchCarousel from '@/components/match-carousel';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { useToast } from '@/hooks/use-toast';


// --- Sub-component for Authenticated Users --- //

function DiscoverPage({ user }: { user: User }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('discover');
  const { toast } = useToast();

  const runAiMatching = async () => {
    setLoading(true);
    setView('results');
    try {
      const res = await handleAiMatching({ userProfile: currentUser, possibleMatches });
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <WanderlinkHeader />
      <main className="flex-1 pb-24 pt-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            {view === 'discover' && (
              <>
                <div>
                  <MatchCarousel profiles={possibleMatches} />
                </div>
                <div className="mt-8">
                   <Button onClick={runAiMatching} disabled={loading} size="lg" className="rounded-full font-bold">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Find my AI Match
                  </Button>
                </div>
              </>
            )}

            {view === 'results' && loading && (
              <div className="flex flex-col items-center justify-center text-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <h2 className="mt-6 text-2xl font-semibold">Finding your perfect match...</h2>
                  <p className="mt-2 text-muted-foreground">Our AI is analyzing profiles to find the best travel partners for you.</p>
              </div>
            )}

            {view === 'results' && !loading && results.length > 0 && (
              <AiMatchResults results={results} profiles={possibleMatches} onReset={resetView} />
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}


// --- Main Component --- //

export default function ConditionalHome() {
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
    return <DiscoverPage user={currentUserAuth} />;
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
