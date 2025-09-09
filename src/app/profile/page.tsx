
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserProfile, addProfilePicture, removeProfilePicture } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { Loader2, Plane, MapPin, Languages, HandCoins, Backpack, Utensils, Cigarette, Wine, Calendar, CheckCircle, Camera, Trash2, PlusCircle, LogOut } from 'lucide-react';
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
    if (!file || !currentUser || (profile?.profilePictures?.length ?? 0) >= MAX_PHOTOS) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await addProfilePicture(currentUser.uid, photoDataUri);
            if (result.success && result.url) {
                setProfile(prev => prev ? { ...prev, profilePictures: [...(prev.profilePictures || []), result.url] } : null);
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
                title: "Erreur d'ajout",
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

  const handlePhotoRemove = async (photoUrl: string) => {
    if (!currentUser) return;
    try {
        const result = await removeProfilePicture(currentUser.uid, photoUrl);
        if (result.success) {
            setProfile(prev => prev ? { ...prev, profilePictures: prev.profilePictures.filter((url: string) => url !== photoUrl)} : null);
            toast({
                title: "Photo supprimée !",
            });
        } else {
            throw new Error(result.error || "La suppression a échoué.");
        }
    } catch (error) {
        console.error("Failed to remove profile picture:", error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        toast({
            variant: "destructive",
            title: "Erreur de suppression",
            description: errorMessage,
        });
    }
  }

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

  const getJsDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    return null;
  }

  const fromDate = getJsDate(profile.dates?.from);
  const toDate = getJsDate(profile.dates?.to);

  const travelDates = fromDate
    ? `${format(fromDate, 'd LLL yyyy', { locale: fr })}${toDate ? ` au ${format(toDate, 'd LLL yyyy', { locale: fr })}` : ''}`
    : 'Dates flexibles';

  const profilePictures = profile.profilePictures || [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
        <WanderlinkHeader />
        <main className="flex-1 pb-24">
            <div className="container mx-auto max-w-4xl py-8">
                 <div className="mb-8 p-6 bg-card rounded-lg shadow-sm text-center">
                    <h1 className="text-4xl font-bold font-headline">{profile.firstName}, {profile.age}</h1>
                    <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{profile.location}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Colonne de gauche: photos */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Photos</h2>
                        <div className="grid grid-cols-2 gap-2">
                           {profilePictures.map((url: string, index: number) => (
                               <div key={index} className="relative aspect-square group">
                                   <Image src={url} alt={`Photo de profil ${index+1}`} fill className="rounded-lg object-cover" />
                                   {isOwner && (
                                       <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handlePhotoRemove(url)}
                                       >
                                           <Trash2 className="h-4 w-4" />
                                       </Button>
                                   )}
                               </div>
                           ))}
                           {isOwner && profilePictures.length < MAX_PHOTOS && (
                               <div 
                                className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
                                onClick={() => fileInputRef.current?.click()}
                               >
                                   <div className="text-center text-muted-foreground">
                                       {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <PlusCircle className="h-8 w-8 mx-auto" />}
                                       <p className="text-sm mt-1">Ajouter</p>
                                   </div>
                               </div>
                           )}
                        </div>
                         <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoAdd}
                            disabled={isUploading}
                        />
                    </div>

                    {/* Colonne du milieu: infos principales */}
                    <div className="md:col-span-1 space-y-8">
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

                    {/* Colonne de droite: détails */}
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

    