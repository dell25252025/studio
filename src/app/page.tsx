
"use client";

import { useState } from 'react';
import type { AIPoweredMatchingOutput } from '@/ai/flows/ai-powered-matching';
import { handleAiMatching } from '@/app/actions';
import AiMatchResults from '@/components/ai-match-results';
import BottomNav from '@/components/bottom-nav';
import MatchCarousel from '@/components/match-carousel';
import WanderlinkHeader from '@/components/wanderlink-header';
import { Button } from '@/components/ui/button';
import { currentUser, possibleMatches } from '@/lib/mock-data';
import { Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [setResults] = useState<AIPoweredMatchingOutput | null>(null);
  const [view, setView] = useState<'discover' | 'results'>('discover');

  const onFindMatches = async () => {
    setLoading(true);
    setView('results');
    try {
      const res = await handleAiMatching({ userProfile: currentUser, possibleMatches });
      setResults(res);
    } catch (error) {
      console.error("Failed to get AI matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <WanderlinkHeader transparent />
      <main className="flex-1 pb-24 pt-16">
        {view === 'discover' && (
          <div className="relative">
            <MatchCarousel profiles={possibleMatches} />
            <div className="fixed bottom-24 left-0 z-10 flex w-full justify-center p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
               <Button size="lg" className="rounded-full shadow-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onFindMatches} disabled>
                <Sparkles className="mr-2 h-5 w-5" />
                Find your AI Matches
              </Button>
            </div>
          </div>
        )}
        {view === 'results' && (
          <div className="container mx-auto max-w-4xl px-4 py-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-2xl font-headline font-semibold text-primary">Finding your travel partners...</h2>
                <p className="text-muted-foreground">Our AI is analyzing profiles to find your perfect match.</p>
              </div>
            ) : (
             <div className="text-center">
                <h2 className="text-2xl font-bold">AI Matching is not available yet.</h2>
                <p>Please check back later.</p>
             </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
