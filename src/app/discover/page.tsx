
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, X } from 'lucide-react';

const FilterPill = ({ label, value, onClick }: { label: string; value: string; onClick: () => void }) => (
    <div className="flex items-center justify-between py-3 text-sm" onClick={onClick}>
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2 text-primary">
            <span>{value}</span>
            <ChevronRight className="h-4 w-4" />
        </div>
    </div>
);


export default function DiscoverPage() {
    const router = useRouter();
    const [showMe, setShowMe] = useState('Femme'); // 'Homme' or 'Femme'
    const [nearby, setNearby] = useState(false);
    const [aroundMyAge, setAroundMyAge] = useState(false);
    const [country, setCountry] = useState('Algeria');
    const [city, setCity] = useState('Tous');

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="fixed top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <X className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">Filtre</h1>
                    <Button variant="link" className="text-primary" onClick={() => router.back()}>
                        Terminé
                    </Button>
                </div>
            </header>

            <main className="pt-14">
                <div className="container mx-auto max-w-4xl px-4 py-6">
                    <div className="space-y-6">
                        {/* Montre-moi Section */}
                        <div className="space-y-3">
                            <h2 className="font-semibold">Montre-moi</h2>
                            <div className="flex w-full rounded-lg bg-muted p-1">
                                <button
                                    onClick={() => setShowMe('Homme')}
                                    className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors ${
                                        showMe === 'Homme' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                    }`}
                                >
                                    Homme
                                </button>
                                <button
                                    onClick={() => setShowMe('Femme')}
                                    className={`w-1/2 rounded-md py-2 text-sm font-medium transition-colors ${
                                        showMe === 'Femme' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                                    }`}
                                >
                                    Femme
                                </button>
                            </div>
                        </div>

                        {/* Position Section */}
                        <div className="space-y-3">
                            <h2 className="font-semibold">Position</h2>
                            <div className="rounded-lg border bg-card p-4">
                                <div className="flex items-center justify-between py-2">
                                    <Label htmlFor="nearby" className="text-sm font-normal">Personnes à proximité</Label>
                                    <Checkbox id="nearby" checked={nearby} onCheckedChange={(checked) => setNearby(Boolean(checked))} />
                                </div>
                                <Separator />
                                <FilterPill label="Pays" value={country} onClick={() => console.log('Open Country Picker')} />
                                <Separator />
                                <FilterPill label="Ville/État" value={city} onClick={() => console.log('Open City Picker')} />
                            </div>
                        </div>

                        {/* Filtrer par Section */}
                        <div className="space-y-3">
                            <h2 className="font-semibold">Filtrer par</h2>
                             <div className="rounded-lg border bg-card p-4">
                                <div className="flex items-center justify-between py-2">
                                    <Label htmlFor="around-my-age" className="text-sm font-normal">Environ mon âge</Label>
                                    <Checkbox id="around-my-age" checked={aroundMyAge} onCheckedChange={(checked) => setAroundMyAge(Boolean(checked))} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
