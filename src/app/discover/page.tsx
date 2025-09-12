'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import WanderlinkHeader from '@/components/wanderlink-header';
import { CountrySelect } from '@/components/country-select';
import { GenericSelect } from '@/components/generic-select';
import { travelIntentions, travelStyles, travelActivities } from '@/lib/options';

export default function DiscoverPage() {
    const router = useRouter();
    const [showMe, setShowMe] = useState('Femme');
    const [nearby, setNearby] = useState(false);
    const [aroundMyAge, setAroundMyAge] = useState(false);
    const [country, setCountry] = useState('');
    const [destination, setDestination] = useState('');
    const [intention, setIntention] = useState('Toutes');
    const [travelStyle, setTravelStyle] = useState('Tous');
    const [activities, setActivities] = useState('Toutes');

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
                                    <CountrySelect className="md:w-1/3" value={country} onValueChange={setCountry} disabled={nearby} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Destination</span>
                                    <CountrySelect className="md:w-1/3" value={destination} onValueChange={setDestination} />
                                </div>
                            </div>
                        </div>

                        {/* Voyage Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Voyage</h2>
                            <div className="rounded-lg border bg-card p-2 space-y-2">
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Intention</span>
                                    <GenericSelect 
                                        className="md:w-1/2"
                                        value={intention} 
                                        onValueChange={setIntention} 
                                        options={travelIntentions} 
                                        placeholder="Toutes"
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Style de voyage</span>
                                    <GenericSelect 
                                        className="md:w-1/2"
                                        value={travelStyle} 
                                        onValueChange={setTravelStyle} 
                                        options={travelStyles} 
                                        placeholder="Tous"
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Activités</span>
                                    <GenericSelect 
                                        className="md:w-1/2"
                                        value={activities} 
                                        onValueChange={setActivities} 
                                        options={travelActivities} 
                                        placeholder="Toutes"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
