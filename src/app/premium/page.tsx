
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsHeader } from '@/components/settings/settings-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';

const premiumFeatures = [
  { text: "Découvrez qui a aimé votre profil et matchez instantanément." },
  { text: "Swipes illimités pour parcourir plus de profils." },
  { text: "Filtres avancés pour trouver le partenaire de voyage parfait." },
  { text: "Passez en mode Incognito et naviguez sans être vu." },
  { text: "Badge Gold exclusif sur votre profil pour vous démarquer." },
  { text: "Débloquez des destinations exclusives." },
];

export default function PremiumPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    // This is a placeholder for the actual subscription logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: 'Fonctionnalité à venir',
      description: "L'abonnement Gold sera bientôt disponible !",
    });
    setIsSubscribing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <SettingsHeader title="WanderLink Gold" />
      <main className="flex items-center justify-center min-h-[calc(100vh-3rem)] p-4 pt-12">
        <Card className="w-full max-w-md shadow-2xl overflow-hidden bg-slate-800/50 border-amber-400/30 backdrop-blur-lg">
           <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-6 text-center text-slate-900 relative overflow-hidden">
              <Sparkles className="absolute -top-4 -left-4 h-24 w-24 text-white/20" />
              <Sparkles className="absolute -bottom-8 -right-0 h-32 w-32 text-white/20" />
              <Crown className="h-12 w-12 mx-auto mb-2 drop-shadow-lg" />
              <h2 className="text-2xl font-bold">Passez à Gold</h2>
              <p className="text-sm opacity-90">Débloquez le meilleur de WanderLink.</p>
           </div>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-amber-400 mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="p-4 border-t border-amber-400/20 bg-slate-900/30">
            <Button 
                className={cn(
                    "w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-yellow-500/20 hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105",
                    isSubscribing && "opacity-80"
                )} 
                size="lg" 
                onClick={handleSubscribe}
                disabled={isSubscribing}
            >
              {isSubscribing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                </>
              ) : (
                `Choisir mon abonnement`
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
