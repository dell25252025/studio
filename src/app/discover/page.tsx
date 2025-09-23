
'use client';

import { useEffect, useState } from 'react';
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
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firebase-actions';
import type { DocumentData } from 'firebase/firestore';
import { Loader2, Search } from 'lucide-react';

export default function DiscoverPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    const [showMe, setShowMe] = useState('Femme');
    const [ageRange, setAgeRange] = useState<[number, number]>([25, 45]);
    const [date, setDate] = useState<DateRange | undefined>();
    const [flexibleDates, setFlexibleDates] = useState(true);
    const [nearby, setNearby] = useState(true);
    const [country, setCountry] = useState('');
    const [destination, setDestination] = useState('Toutes');
    const [intention, setIntention] = useState('');
    const [travelStyle, setTravelStyle] = useState('Tous');
    const [activities, setActivities] = useState('Toutes');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                getUserProfile(user.uid).then(profile => {
                    setUserProfile(profile);
                    if (profile) {
                         if (profile.gender === 'Femme') {
                            setShowMe('Homme');
                        } else if (profile.gender === 'Autre') {
                            setShowMe('Autre');
                        } else {
                            setShowMe('Femme');
                        }
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);


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

    const uniformSelectClass = "w-3/5 md:w-[45%] h-8 text-xs";

    if (loading) {
         return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <WanderlinkHeader />
            <main className="pt-12 pb-24">
                <div className="container mx-auto max-w-4xl px-4">
                     {/* Montre-moi Section */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-xs">Montre-moi</h2>
                      </div>
                      <div className="flex justify-center">
                        <ToggleGroup
                          type="single"
                          value={showMe}
                          onValueChange={(value) => { if (value) setShowMe(value) }}
                          className="w-auto justify-start bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full"
                          variant='outline'
                          size="sm"
                        >
                          <ToggleGroupItem value="Homme" aria-label="Montrer les hommes" className="text-xs h-7">Homme</ToggleGroupItem>
                          <ToggleGroupItem value="Femme" aria-label="Montrer les femmes" className="text-xs h-7">Femme</ToggleGroupItem>
                          <ToggleGroupItem value="Autre" aria-label="Montrer les autres personnes" className="text-xs h-7">Autre</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                
                    <div className="space-y-2">
                        {/* Age Section */}
                        <div className="rounded-lg border bg-card p-1.5">
                            <AgeRangeSlider
                                value={ageRange}
                                onValueChange={setAgeRange}
                                className="text-xs"
                            />
                        </div>

                        {/* Position Section */}
                        <div className="space-y-0.5">
                            <h2 className="font-semibold text-xs">Position</h2>
                            <div className="rounded-lg border bg-card p-1 space-y-1">
                                <div className="flex items-center justify-between py-1 px-1">
                                    <Label htmlFor="nearby" className="text-xs font-normal">Personnes à proximité</Label>
                                    <Checkbox id="nearby" checked={nearby} onCheckedChange={handleNearbyChange} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 px-1 text-xs">
                                    <span className={cn('text-muted-foreground', nearby && 'text-slate-400 dark:text-slate-600')}>Pays</span>
                                    <CountrySelect className={uniformSelectClass} value={country} onValueChange={setCountry} disabled={nearby} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1 px-1 text-xs">
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
                        <div className="space-y-1">
                          <h2 className="font-semibold text-xs">Dates de voyage</h2>
                            <div className="rounded-lg border bg-card p-1.5 space-y-1.5">
                                <DateRangePicker date={date} onDateChange={setDate} disabled={flexibleDates} />
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="flexible-dates" checked={flexibleDates} onCheckedChange={handleFlexibleDatesChange} />
                                    <Label htmlFor="flexible-dates" className="text-xs">Mes dates sont flexibles</Label>
                                </div>
                            </div>
                        </div>

                        {/* Voyage Section */}
                        <div className="space-y-0.5">
                            <h2 className="font-semibold text-xs">Voyage</h2>
                            <div className="rounded-lg border bg-card p-1 space-y-1">
                                <div className="flex items-center justify-between py-1 px-1 text-xs">
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
                                <div className="flex items-center justify-between py-1 px-1 text-xs">
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
                                <div className="flex items-center justify-between py-1 px-1 text-xs">
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
            <footer className="fixed bottom-0 z-10 w-full p-2 bg-background/80 backdrop-blur-sm border-t">
                <Button onClick={handleSearch} size="lg" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Recherche
                </Button>
            </footer>
        </div>
    );
}
