
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function DiscoverPage() {
  const router = useRouter();
  const [gender, setGender] = useState('Femme');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 z-20 w-full h-12 flex items-center justify-between border-b bg-background/95 px-2 py-1 backdrop-blur-sm md:px-4">
        <Link href="/" passHref>
            <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
            </Button>
        </Link>
        <h1 className="text-lg font-semibold">Filtre</h1>
        <Button variant="link" className="text-primary font-bold px-2">
            Terminé
        </Button>
      </header>
      
      <main className="flex-1 pt-16 px-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Montre-moi</Label>
             <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
              {['Homme', 'Femme', 'Non-binaire'].map((g) => (
                <Button
                  key={g}
                  variant={gender === g ? 'default' : 'ghost'}
                  onClick={() => setGender(g)}
                  className="transition-colors duration-200"
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Position</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="nearby">Personnes à proximité</Label>
                <Switch id="nearby" />
              </div>
              <Separator />
              <button className="flex items-center justify-between w-full text-left py-3">
                <Label>Pays</Label>
                <div className="flex items-center gap-2 text-primary">
                  <span>Algeria</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
              <Separator />
               <button className="flex items-center justify-between w-full text-left py-3">
                <Label>Ville/État</Label>
                <div className="flex items-center gap-2 text-primary">
                  <span>Tous</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          </div>

          <Separator />

           <div className="space-y-4">
            <Label className="text-lg font-semibold">Filtrer par</Label>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="similar-age">Environ mon âge</Label>
              <Switch id="similar-age" />
            </div>
          </div>
        </div>
      </main>

       <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-t">
          <Button size="lg" className="w-full">
            Voir les profils
          </Button>
      </footer>
    </div>
  );
}
