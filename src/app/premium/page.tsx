
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsHeader } from '@/components/settings/settings-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const premiumFeatures = [
  { text: "Découvrez qui a aimé votre profil et matchez instantanément." },
  { text: "Swipes illimités pour parcourir plus de profils." },
  { text: "Filtres avancés pour trouver le partenaire de voyage parfait." },
  { text: "Passez en mode Incognito et naviguez sans être vu." },
  { text: "Badge Gold exclusif sur votre profil pour vous démarquer." },
  { text: "Débloquez des destinations exclusives." },
];

const productId = 'wanderlink_gold_monthly';

export default function PremiumPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    
    // TODO: Intégrer la logique d'achat avec l'API Google Play Billing
    // Pour l'instant, nous allons simuler un succès.
    
    console.log(`Lancement du processus d'abonnement pour le produit : ${productId}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simule l'appel API

    toast({
      title: "Félicitations et bienvenue !",
      description: "Vous êtes maintenant membre WanderLink Gold.",
    });

    setIsSubscribing(false);
    router.push('/'); // Redirige l'utilisateur après l'abonnement
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="WanderLink Gold" />
      <main className="flex items-center justify-center min-h-[calc(100vh-3rem)] p-4 pt-12">
        <Card className="w-full max-w-md shadow-lg overflow-hidden border-yellow-500/50">
           <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-6 text-center text-white">
              <Crown className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Passez à Gold</h2>
              <p className="text-sm opacity-90">Débloquez le meilleur de WanderLink.</p>
           </div>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="p-4 border-t bg-background/50">
            <Button 
                className={cn(
                    "w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105",
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
                "S'abonner maintenant (9.99 €/mois)"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
