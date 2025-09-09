
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserProfile, addProfilePicture, removeProfilePicture } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { Loader2, Plane, MapPin, Languages, HandCoins, Backpack, Cigarette, Wine, Calendar, Camera, Trash2, PlusCircle, LogOut, Edit } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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

const MAX_PHOTOS = 4;

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('id');
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

   useEffect(() => {
    if (!profileId) {
      router.push('/');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
        if (user && user.uid === profileId) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    });
    return () => unsubscribe();
  }, [profileId, router]);


  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const profileData = await getUserProfile(profileId as string);
          setProfile(profileData);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast({
            variant: "destructive",
            title: "Erreur de chargement",
            description: "Impossible de récupérer les informations du profil."
          })
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [profileId, toast]);

  const handlePhotoAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await addProfilePicture(currentUser.uid, photoDataUri);

            if (result.success && result.url) {
                setProfile(prev => {
                    if (!prev) return null;
                    const newPictures = [...(prev.profilePictures || []), result.url];
                    return { ...prev, profilePictures: newPictures };
                });
                toast({
                    title: "Photo ajoutée !",
                    description: "Votre nouvelle photo est visible.",
                });
            } else {
              throw new Error(result.error || "L'ajout de la photo a échoué.")
            }
        } catch (error) {
            console.error("Failed to add profile picture:", error);
            const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
            toast({
                variant: "destructive",
                title: "Erreur de mise à jour",
                description: errorMessage,
            });
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
     reader.onerror = (error) => {
        console.error("File reading error:", error);
        setIsUploading(false);
        toast({
            variant: "destructive",
            title: "Erreur de lecture du fichier",
            description: "Impossible de lire la photo sélectionnée.",
        });
    };
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      router.push('/');
    } catch (error) {
      console.error("Sign out error", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: errorMessage,
      });
    }
  };

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
                     <Button onClick={() => router.push('/')} className="mt-4">Retour à l'accueil</Button>
                </div>
            </main>
            <BottomNav />
      </div>
    );
  }
  
  const fromDate = profile.dates?.from ? new Date(profile.dates.from) : null;
  const toDate = profile.dates?.to ? new Date(profile.dates.to) : null;

  const travelDates = profile.flexibleDates
    ? 'Dates flexibles'
    : fromDate
      ? `${format(fromDate, 'd LLL yyyy', { locale: fr })}${toDate ? ` au ${format(toDate, 'd LLL yyyy', { locale: fr })}` : ''}`
      : 'Non spécifié';

  const profilePictures = profile.profilePictures && profile.profilePictures.length > 0 ? profile.profilePictures : [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
        <WanderlinkHeader />
        <main className="flex-1 pb-24">
            <div className="relative h-[60vh] w-full bg-muted text-white">
                {profilePictures.length > 0 ? (
                    <Carousel
                        className="w-full h-full"
                        plugins={[Autoplay({ delay: 3000 })]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {profilePictures.map((src: string, index: number) => (
                                <CarouselItem key={index}>
                                    <div className="relative h-[60vh] w-full">
                                        <Image 
                                            src={src}
                                            alt={`Photo de profil de ${profile.firstName} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-card">
                         <Camera className="h-24 w-24 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold font-headline text-shadow-lg">{profile.firstName}, {profile.age}</h1>
                        <div className="flex items-center gap-2 mt-2 text-shadow">
                            <MapPin className="h-5 w-5" />
                            <span>{profile.location}</span>
                        </div>
                    </div>
                    {isOwner && (
                        <div>
                           <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                <Camera className="mr-2 h-4 w-4" />
                                {isUploading ? 'Chargement...' : 'Changer la photo'}
                           </Button>
                           <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoAdd}
                                disabled={isUploading || profilePictures.length >= MAX_PHOTOS}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto max-w-4xl py-8 space-y-8 -mt-16">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2 space-y-8">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Ma description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{profile.bio || "Aucune description fournie."}</p>
                            </CardContent>
                        </Card>
                         <Card className="shadow-lg">
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
                        <Card className="shadow-lg">
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
                        {isOwner && (
                            <div className="flex justify-center">
                                <Button size="lg" variant="outline" onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Se déconnecter
                                </Button>
                            </div>
                        )}
                        {!isOwner && (
                            <div className="flex justify-center">
                                <Button size="lg">Envoyer un message</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
        <BottomNav />
    </div>
  );
}

    