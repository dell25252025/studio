
'use client';

import { useEffect, useState } from 'react';
import { type AIPoweredMatchingInput } from '@/ai/flows/ai-powered-matching';
import { handleAiMatching } from '@/app/actions';
import { currentUser, possibleMatches } from '@/lib/mock-data';
import AiMatchResults from '@/components/ai-match-results';
import { Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';
import MatchCarousel from '@/components/match-carousel';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('discover');
  const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserAuth(user);
    });
    return () => unsubscribe();
  }, []);

  const runAiMatching = async () => {
    if (!currentUserAuth) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to use AI matching.',
      });
      return;
    }
    setLoading(true);
    setView('results');
    try {
      const res = await handleAiMatching({ userProfile: currentUser, possibleMatches });
      setResults(res);
    } catch (error) {
      console.error("Failed to get AI matches:", error);
    }
     finally {
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
