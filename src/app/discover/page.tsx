'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import WanderlinkHeader from '@/components/wanderlink-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CountrySelect } from '@/components/country-select';

export default function DiscoverPage() {
    const router = useRouter();
    const [showMe, setShowMe] = useState('Femme');
    const [nearby, setNearby] = useState(false);
    const [aroundMyAge, setAroundMyAge] = useState(false);
    const [country, setCountry] = useState('');
    const [destination, setDestination] = useState('');
    const [intention, setIntention] = useState('Tous');
    const [travelStyle, setTravelStyle] = useState('Tous');
    const [activities, setActivities] = useState('Tous');

    const handleNearbyChange = (checked: boolean) => {
        setNearby(checked);
        if (checked) {
            setCountry('');
        }
    };

    const handleSearch = () => {
        console.log("Recherche lancée avec les filtres :");
        console.log({ showMe, nearby, country, destination, intention, travelStyle, activities, aroundMyAge });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <WanderlinkHeader />
            <main className="pt-16 pb-24">
                <div className="container mx-auto max-w-4xl px-4 py-2">
                    <div className="space-y-2">

                        {/* Position Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Position</h2>
                            <div className="rounded-lg border bg-card p-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <Label htmlFor="nearby" className="text-sm font-normal">Personnes à proximité</Label>
                                    <Checkbox id="nearby" checked={nearby} onCheckedChange={handleNearbyChange} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className={cn('text-muted-foreground', nearby && 'text-slate-400 dark:text-slate-600')}>Pays</span>
                                    <CountrySelect value={country} onValueChange={setCountry} disabled={nearby} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Destination</span>
                                    <CountrySelect value={destination} onValueChange={setDestination} />
                                </div>
                            </div>
                        </div>

                        {/* Voyage Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Voyage</h2>
                            <div className="rounded-lg border bg-card p-2 space-y-2">
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Intention</span>
                                    <Select value={intention} onValueChange={setIntention}>
                                        <SelectTrigger className="w-[110px] h-8">
                                            <SelectValue placeholder="Sélection" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            <SelectItem value="Tous">Toutes</SelectItem>
                                            <SelectItem value="Partager les frais (50/50)">50/50</SelectItem>
                                            <SelectItem value="Je peux sponsoriser le voyage">Sponsor</SelectItem>
                                            <SelectItem value="Je cherche un voyage sponsorisé">Sponsorisé</SelectItem>
                                            <SelectItem value="Organiser un voyage de groupe">Groupe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Style de voyage</span>
                                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                                        <SelectTrigger className="w-[110px] h-8">
                                            <SelectValue placeholder="Sélection" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                             <SelectItem value="Tous">Tous</SelectItem>
                                             <SelectItem value="Aventure / Sac à dos">Aventure</SelectItem>
                                             <SelectItem value="Luxe / Détente">Luxe</SelectItem>
                                             <SelectItem value="Culturel / Historique">Culturel</SelectItem>
                                             <SelectItem value="Festif / Événementiel">Festif</SelectItem>
                                             <SelectItem value="Religieux / Spirituel">Religieux</SelectItem>
                                             <SelectItem value="Road Trip / Van Life">Road Trip</SelectItem>
                                             <SelectItem value="Humanitaire / Écovolontariat">Humanitaire</SelectItem>
                                             <SelectItem value="Autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Activités</span>
                                     <Select value={activities} onValueChange={setActivities}>
                                        <SelectTrigger className="w-[110px] h-8">
                                            <SelectValue placeholder="Sélection" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            <SelectItem value="Tous">Toutes</SelectItem>
                                            <SelectItem value="Randonnée">Randonnée</SelectItem>
                                            <SelectItem value="Plage">Plage</SelectItem>
                                            <SelectItem value="Musées">Musées</SelectItem>
                                            <SelectItem value="Concerts / Festivals">Festivals</SelectItem>
                                            <SelectItem value="Gastronomie">Gastronomie</SelectItem>
                                            <SelectItem value="Sorties nocturnes">Vie nocturne</SelectItem>
                                            <SelectItem value="Shopping">Shopping</SelectItem>
                                            <SelectItem value="Yoga / Méditation">Yoga</SelectItem>
                                            <SelectItem value="Sport">Sport</SelectItem>
                                            <SelectItem value="Pèlerinage">Pèlerinage</SelectItem>
                                            <SelectItem value="Événement LGBT+">LGBT+</SelectItem>
                                            <SelectItem value="Camping">Camping</SelectItem>
                                            <SelectItem value="Autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
