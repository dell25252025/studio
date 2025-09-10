
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Sparkles, X } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function FilterSheet({ isOpen, onOpenChange }: FilterSheetProps) {
  const [gender, setGender] = useState('Femme');

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-full max-h-screen md:h-auto md:max-h-[90vh] flex flex-col rounded-t-2xl"
      >
        <SheetHeader className="flex flex-row items-center justify-between text-center pb-4 border-b">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
          <SheetTitle className="text-lg font-semibold">Filtre</SheetTitle>
          <Button variant="link" className="text-primary font-bold text-base px-0 h-auto">
            Terminé
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <Label className="font-semibold text-base">Recherche IA</Label>
            <div className="relative">
              <Input
                placeholder="Décris ton partenaire de voyage idéal..."
                className="pl-10"
              />
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <Label className="font-semibold text-base">Montre-moi</Label>
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

          <div className="space-y-4">
            <Label className="font-semibold text-base">Intention</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les intentions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les intentions</SelectItem>
                <SelectItem value="50/50">Partager les frais (50/50)</SelectItem>
                <SelectItem value="sponsor">Je peux sponsoriser</SelectItem>
                <SelectItem value="sponsored">Je cherche un sponsor</SelectItem>
                <SelectItem value="group">Voyage de groupe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="font-semibold text-base">Destination</Label>
            <Input placeholder="Pays, Ville..." />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="nearby" className="text-base">
                Personnes à proximité
              </Label>
              <Switch id="nearby" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="similar-age" className="text-base">
                Environ mon âge
              </Label>
              <Switch id="similar-age" />
            </div>
          </div>
        </div>

        <SheetFooter className="p-4 border-t">
          <Button size="lg" className="w-full">
            Voir les profils
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
