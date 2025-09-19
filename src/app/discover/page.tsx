
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { AgeRangeSlider } from '@/components/ui/age-range-slider';
import { type DateRange } from 'react-day-picker';
import { travelIntentions, travelStyles, travelActivities } from '@/lib/options';

export default function DiscoverPage() {
    const router = useRouter();
    const [showMe, setShowMe] = useState('Femme');
    const [ageRange, setAgeRange] = useState<[number, number]>([25, 45]);
    const [date, setDate] = useState<DateRange | undefined>();
    const [flexibleDates, setFlexibleDates] = useState(false);
    const [nearby, setNearby] = useState(false);
    const [country, setCountry] = useState('');
    const [destination, setDestination] = useState('Toutes');
    const [intention, setIntention] = useState('');
    const [travelStyle, setTravelStyle] = useState('Tous');
    const [activities, setActivities] = useState('Toutes');

    const handleNearbyChange = (checked: boolean) => {
        setNearby(checked);
        if (checked) {
            setCountry('');
        }
    };

    const handleFlexibleDatesChange = (checked: boolean) => {
        setFlexibleDates(checked);
        if (checked) {
            setDate(undefined);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        
        if (showMe) params.set('showMe', showMe);
        if (ageRange) {
            params.set('minAge', ageRange[0].toString());
            params.set('maxAge', ageRange[1].toString());
        }
        if (date?.from) params.set('dateFrom', date.from.toISOString());
        if (date?.to) params.set('dateTo', date.to.toISOString());
        if (flexibleDates) params.set('flexibleDates', 'true');
        if (nearby) params.set('nearby', 'true');
        if (country && !nearby) params.set('country', country);
        if (destination && destination !== 'Toutes') params.set('destination', destination);
        if (intention) params.set('intention', intention);
        if (travelStyle && travelStyle !== 'Tous') params.set('travelStyle', travelStyle);
        if (activities && activities !== 'Toutes') params.set('activities', activities);
        
        router.push(`/?${params.toString()}`);
    };

    const uniformSelectClass = "w-3/5 md:w-[45%]";

    return (
        <div className="min-h-screen bg-background text-foreground">
            <WanderlinkHeader />
            <main className="pt-16 pb-24">
                <div className="container mx-auto max-w-4xl px-4 py-2">
                    <div className="space-y-4">

                        {/* Montre-moi Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Montre-moi</h2>
                            <Button onClick={handleSearch} variant="ghost">Terminé</Button>
                          </div>
                          <div className="flex justify-center">
                            <ToggleGroup
                              type="single"
                              value={showMe}
                              onValueChange={(value) => { if (value) setShowMe(value) }}
                              className="w-auto justify-start bg-slate-100 dark:bg-slate-800 p-1 rounded-full"
                              variant='outline'
                            >
                              <ToggleGroupItem value="Homme" aria-label="Montrer les hommes">Homme</ToggleGroupItem>
                              <ToggleGroupItem value="Femme" aria-label="Montrer les femmes">Femme</ToggleGroupItem>
                              <ToggleGroupItem value="Non-binaire" aria-label="Montrer les personnes non-binaires">Non-binaire</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </div>

                        {/* Age Section */}
                        <div className="rounded-lg border bg-card p-3">
                            <AgeRangeSlider
                                value={ageRange}
                                onValueChange={setAgeRange}
                            />
                        </div>

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
                                    <CountrySelect className={uniformSelectClass} value={country} onValueChange={setCountry} disabled={nearby} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Destination</span>
                                    <CountrySelect 
                                        className={uniformSelectClass} 
                                        value={destination} 
                                        onValueChange={setDestination} 
                                        placeholder="Toutes"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates de voyage Section */}
                        <div className="space-y-2">
                          <h2 className="font-semibold">Dates de voyage</h2>
                            <div className="rounded-lg border bg-card p-2 space-y-2">
                                <DateRangePicker date={date} onDateChange={setDate} disabled={flexibleDates} />
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="flexible-dates" checked={flexibleDates} onCheckedChange={handleFlexibleDatesChange} />
                                    <Label htmlFor="flexible-dates">Mes dates sont flexibles</Label>
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
                                        className={uniformSelectClass}
                                        value={intention} 
                                        onValueChange={setIntention} 
                                        options={[{ value: '', label: 'Toutes' }, ...travelIntentions]}
                                        placeholder="Toutes"
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 text-sm">
                                    <span className="text-muted-foreground">Style de voyage</span>
                                    <GenericSelect 
                                        className={uniformSelectClass}
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
                                        className={uniformSelectClass}
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
