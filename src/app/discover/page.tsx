
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import WanderlinkHeader from '@/components/wanderlink-header';

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
    const [dates, setDates] = useState<DateRange | undefined>(undefined);
    const [flexibleDates, setFlexibleDates] = useState(false);

    const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

    const handleNearbyChange = (checked: boolean) => {
        setNearby(checked);
        if (checked) {
            setCountry(''); // Reset country when nearby is checked
            // Logic to get user's location would be triggered here
            // For example: navigator.geolocation.getCurrentPosition(...)
        }
    };

    const handleSearch = () => {
        // Logic for the search will be implemented here
        console.log("Recherche lancée avec les filtres :");
        console.log({ showMe, nearby, country, destination, dates, flexibleDates, intention, travelStyle, activities, aroundMyAge });
        // router.push('/results?...');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <WanderlinkHeader />

            <main className="pt-6 pb-24">
                <div className="container mx-auto max-w-4xl px-4 py-2">
                    <div className="space-y-1">
                        {/* Montre-moi Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Montre-moi</h2>
                            <div className="flex w-full rounded-lg bg-muted p-1">
                                <button
                                    onClick={() => setShowMe('Homme')}
                                    className={`w-1/3 rounded-md py-1.5 text-sm font-medium transition-colors ${
                                        showMe === 'Homme' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                    }`}
                                >
                                    Homme
                                </button>
                                <button
                                    onClick={() => setShowMe('Femme')}
                                    className={`w-1/3 rounded-md py-1.5 text-sm font-medium transition-colors ${
                                        showMe === 'Femme' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                    }`}
                                >
                                    Femme
                                </button>
                                <button
                                    onClick={() => setShowMe('Non-binaire')}
                                    className={`w-1/3 rounded-md py-1.5 text-sm font-medium transition-colors ${
                                        showMe === 'Non-binaire' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                    }`}
                                >
                                    Non-binaire
                                </button>
                            </div>
                        </div>

                        {/* Position Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Position</h2>
                            <div className="rounded-lg border bg-card p-2">
                                <div className="flex items-center justify-between py-1.5">
                                    <Label htmlFor="nearby" className="text-sm font-normal">Personnes à proximité</Label>
                                    <Checkbox id="nearby" checked={nearby} onCheckedChange={handleNearbyChange} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1.5 text-sm">
                                    <span className={cn('text-muted-foreground', nearby && 'text-slate-400 dark:text-slate-600')}>Pays</span>
                                    <Select value={country} onValueChange={setCountry} disabled={nearby}>
                                        <SelectTrigger className="w-[90px] h-8">
                                            <SelectValue placeholder="Sélection" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            <SelectItem value="Tous">Tous</SelectItem>
                                            {sortedCountries.map((country) => (
                                                <SelectItem key={country.code} value={country.name}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-1.5 text-sm">
                                    <span className="text-muted-foreground">Destination</span>
                                    <Select value={destination} onValueChange={setDestination}>
                                        <SelectTrigger className="w-[90px] h-8">
                                            <SelectValue placeholder="Sélection" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" side="bottom">
                                            <SelectItem value="Tous">Toutes</SelectItem>
                                            {sortedCountries.map((country) => (
                                                <SelectItem key={country.code} value={country.name}>
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Dates Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Dates de voyage</h2>
                            <div className="rounded-lg border bg-card p-2 space-y-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        id="date"
                                        variant={'outline'}
                                        className={cn(
                                          'w-full justify-start text-left font-normal h-8',
                                          !dates && !flexibleDates && 'text-muted-foreground'
                                        )}
                                        disabled={flexibleDates}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {flexibleDates ? 'Dates flexibles' : dates?.from ? (
                                          dates.to ? (
                                            <>
                                              {format(dates.from, 'd LLL', { locale: fr })} -{' '}
                                              {format(dates.to, 'd LLL', { locale: fr })}
                                            </>
                                          ) : (
                                            format(dates.from, 'd LLL y', { locale: fr })
                                          )
                                        ) : (
                                          <span>Choisissez une période</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dates?.from}
                                        selected={dates}
                                        onSelect={setDates}
                                        numberOfMonths={2}
                                        locale={fr}
                                      />
                                    </PopoverContent>
                                </Popover>
                                <div className="flex items-center space-x-2 py-1.5">
                                    <Checkbox id="flexible-dates" checked={flexibleDates} onCheckedChange={(checked) => setFlexibleDates(Boolean(checked))} />
                                    <Label htmlFor="flexible-dates" className="text-sm font-normal">Mes dates sont flexibles</Label>
                                </div>
                            </div>
                        </div>

                        {/* Voyage Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Voyage</h2>
                            <div className="rounded-lg border bg-card p-2">
                                <div className="flex items-center justify-between py-1.5 text-sm">
                                    <span className="text-muted-foreground">Intention</span>
                                    <Select value={intention} onValueChange={setIntention}>
                                        <SelectTrigger className="w-[90px] h-8">
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
                                <div className="flex items-center justify-between py-1.5 text-sm">
                                    <span className="text-muted-foreground">Style de voyage</span>
                                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                                        <SelectTrigger className="w-[90px] h-8">
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
                                <div className="flex items-center justify-between py-1.5 text-sm">
                                    <span className="text-muted-foreground">Activités</span>
                                     <Select value={activities} onValueChange={setActivities}>
                                        <SelectTrigger className="w-[90px] h-8">
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

                        {/* Filtrer par Section */}
                        <div className="space-y-1">
                            <h2 className="font-semibold">Filtrer par</h2>
                             <div className="rounded-lg border bg-card p-2">
                                <div className="flex items-center justify-between py-1.5">
                                    <Label htmlFor="around-my-age" className="text-sm font-normal">Environ mon âge</Label>
                                    <Checkbox id="around-my-age" checked={aroundMyAge} onCheckedChange={(checked) => setAroundMyAge(Boolean(checked))} />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="pt-4">
                            <Button className="w-full" onClick={handleSearch}>Recherche</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
