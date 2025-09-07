
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getUserProfile } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { Loader2, Plane, MapPin, Languages, HandCoins, Backpack, Utensils, Cigarette, Wine, Calendar, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const activityMap = {
  hiking: 'Randonnée',
  beach: 'Plage',
  museums: 'Musées',
  concerts: 'Concerts / Festivals',
  food: 'Gastronomie',
  nightlife: 'Sorties nocturnes',
  shopping: 'Shopping',
  yoga: 'Yoga / Méditation',
};


export default function ProfilePage() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        try {
          const profileData = await getUserProfile(profileId);
          setProfile(profileData);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="flex min-h-screen flex-col">
            <WanderlinkHeader />
            <main className="flex-1 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold">Profil non trouvé</h2>
                    <p className="text-muted-foreground">Impossible de charger les informations de ce profil.</p>
                </div>
            </main>
            <BottomNav />
      </div>
    );
  }

   const travelDates = profile.dates?.from 
    ? `${format(new Date(profile.dates.from), 'd LLL yyyy', { locale: fr })} au ${profile.dates.to ? format(new Date(profile.dates.to), 'd LLL yyyy', { locale: fr }) : ''}` 
    : 'Dates flexibles';


  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
        <WanderlinkHeader />
        <main className="flex-1 pb-24">
            <div className="relative h-96">
                <Carousel className="w-full h-full">
                    <CarouselContent>
                        {profile.photos.map((photo: string, index: number) => (
                        <CarouselItem key={index}>
                            <div className="relative h-96 w-full">
                            <Image
                                src={photo}
                                alt={`Photo de ${profile.firstName} ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="w-full h-full"
                                data-ai-hint="person image"
                            />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-4xl font-bold font-headline">{profile.firstName}, {profile.age}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-5 w-5" />
                        <span>{profile.location}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ma description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{profile.bio || "Aucune description fournie."}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Mon Prochain Voyage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-3">
                                <Plane className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Destination</p>
                                    <p className="text-muted-foreground">{profile.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Dates</p>
                                    <p className="text-muted-foreground">{travelDates}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Backpack className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Style de voyage</p>
                                    <p className="text-muted-foreground">{profile.travelStyle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <HandCoins className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Intention</p>
                                    <p className="text-muted-foreground">{profile.financialArrangement}</p>
                                </div>
                            </div>
                            {profile.activities && profile.activities.length > 0 && (
                                <div>
                                    <p className="font-semibold mb-2">Activités prévues</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.activities.map((activity: keyof typeof activityMap) => (
                                            <Badge key={activity} variant="secondary">{activityMap[activity] || activity}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-8">
                    <Card>
                         <CardHeader>
                            <CardTitle>Détails</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Languages className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Langues parlées</p>
                                    <p className="text-muted-foreground">{profile.languages.join(', ')}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <Cigarette className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Tabac</p>
                                    <p className="text-muted-foreground">{profile.tobacco || 'Non spécifié'}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <Wine className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Alcool</p>
                                    <p className="text-muted-foreground">{profile.alcohol || 'Non spécifié'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
        <BottomNav />
    </div>
  );
}
