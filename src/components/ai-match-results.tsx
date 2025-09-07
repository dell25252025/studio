import type { AIPoweredMatchingOutput } from '@/ai/flows/ai-powered-matching';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Sparkles, Star } from 'lucide-react';

interface AiMatchResultsProps {
  results: AIPoweredMatchingOutput;
  profiles: UserProfile[];
  onReset: () => void;
}

const AiMatchResults: React.FC<AiMatchResultsProps> = ({ results, profiles, onReset }) => {

  const sortedResults = [...results].sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return (
    <div className="w-full">
      <Button variant="ghost" onClick={onReset} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Discover
      </Button>
      <div className="text-center mb-8">
        <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Sparkles className="mr-2 h-5 w-5" />
          <span>AI Powered Matches</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
          Your Top Travel Companions
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Based on your profile, here are the people you're most compatible with for your next adventure.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedResults.map((result) => {
          const profile = profiles[result.matchIndex];
          if (!profile) return null;

          return (
            <Card key={profile.id} className="overflow-hidden flex flex-col">
              <CardHeader className="p-0 relative h-48">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  data-ai-hint="person traveling"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-accent text-accent-foreground flex items-center gap-1 shadow-md">
                     <Star className="h-3 w-3" /> {result.compatibilityScore}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col">
                <CardTitle className="font-headline text-xl">{profile.name}, {profile.age}</CardTitle>
                <CardDescription className="mt-2 text-primary/80 font-semibold">{result.reason}</CardDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{profile.travelIntention}</Badge>
                  <Badge variant="secondary">{profile.travelStyle}</Badge>
                  <Badge variant="secondary">{profile.dreamDestinations[0]}</Badge>
                </div>
                <div className="mt-auto pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Send className="mr-2 h-4 w-4" />
                    Message {profile.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AiMatchResults;
