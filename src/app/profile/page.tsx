
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserProfile, addProfilePicture, removeProfilePicture } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { Loader2, Plane, MapPin, Languages, Backpack, Cigarette, Wine, Calendar, Camera, Trash2, PlusCircle, LogOut, Edit, Ruler, Scale, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, X, Sparkles, BriefcaseBusiness, Coins, Users, MoreVertical, ShieldAlert, Ban, Send, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader as DrawerHeaderComponent, DrawerTitle, DrawerDescription as DrawerDescriptionComponent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { countries } from '@/lib/countries';
import { travelIntentions, travelStyles, travelActivities } from '@/lib/options';


const CannabisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V7l-8-5-8 5v5c0 6 8 10 8 10z"></path>
    <path d="m9 11 3 3 3-3"></path>
    <path d="M12 14V8"></path>
    <path d="M12 22v-6"></path>
    <path d="M15.5 13.5c1.5-1.5 1.5-3.5 0-5s-3.5-1.5-5 0c-1.5 1.5-1.5 3.5 0 5"></path>
  </svg>
);

const intentionMap: { [key: string]: { icon: React.ElementType, color: string, text: string } } = {
  'Sponsor': { icon: BriefcaseBusiness, color: 'bg-green-500', text: 'Sponsor' },
  'Sponsorisé': { icon: Coins, color: 'bg-yellow-500', text: 'Sponsorisé' },
  '50/50': { icon: Users, color: 'bg-blue-500', text: '50/50' },
  'Groupe': { icon: Users, color: 'bg-red-500', text: 'Groupe' },
};

const MAX_PHOTOS = 4;

const PhotoViewer = ({ images, startIndex }: { images: string[], startIndex: number }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const lastDist = useRef(0);

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        lastDist.current = 0;
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        resetZoom();
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        resetZoom();
    };

    const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 1));
    
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.ctrlKey) {
                setScale(s => Math.max(1, Math.min(3, s - e.deltaY * 0.01)));
            } else {
                setPosition(p => ({
                    x: p.x - e.deltaX,
                    y: p.y - e.deltaY
                }));
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastDist.current = Math.sqrt(dx * dx + dy * dy);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const change = dist - lastDist.current;
                setScale(s => Math.max(1, Math.min(3, s + change * 0.01)));
                lastDist.current = dist;
            }
        };

        const imageEl = imageRef.current;
        imageEl?.addEventListener('wheel', handleWheel);
        imageEl?.addEventListener('touchstart', handleTouchStart);
        imageEl?.addEventListener('touchmove', handleTouchMove);
        return () => {
            imageEl?.removeEventListener('wheel', handleWheel);
            imageEl?.removeEventListener('touchstart', handleTouchStart);
            imageEl?.removeEventListener('touchmove', handleTouchMove);
        }
    }, [currentIndex]);
    
    useEffect(() => {
        if (scale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [scale]);

    return (
        <DialogContent className="p-0 m-0 w-full h-full max-w-full max-h-screen bg-black/80 backdrop-blur-sm border-0 flex flex-col items-center justify-center">
            <DialogHeader className="sr-only">
                <DialogTitle>Visionneuse de photos</DialogTitle>
                <DialogDescription>
                    Agrandissement de la photo de profil. Utilisez les flèches pour naviguer et les boutons pour zoomer.
                </DialogDescription>
            </DialogHeader>
             <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <Image
                    ref={imageRef}
                    src={images[currentIndex]}
                    alt={`Photo de profil ${currentIndex + 1}`}
                    fill
                    className="object-contain transition-transform duration-200"
                    style={{
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        cursor: scale > 1 ? 'grab' : 'auto',
                    }}
                    onMouseDown={(e) => {
                        if (scale <= 1) return;
                        const startPos = { x: e.clientX - position.x, y: e.clientY - position.y };
                        const handleMouseMove = (me: MouseEvent) => {
                            setPosition({ x: me.clientX - startPos.x, y: me.clientY - startPos.y });
                        };
                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                />
            </div>
            {images.length > 1 && (
                <>
                    <Button onClick={handlePrev} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 hover:text-white"><ArrowLeft /></Button>
                    <Button onClick={handleNext} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 hover:text-white"><ArrowRight /></Button>
                </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-black/30 text-white">
                <Button onClick={handleZoomOut} variant="ghost" size="icon" disabled={scale <= 1} className="hover:bg-black/50 hover:text-white"><ZoomOut /></Button>
                <span className="min-w-[4ch] text-center font-mono">{(scale * 100).toFixed(0)}%</span>
                <Button onClick={handleZoomIn} variant="ghost" size="icon" disabled={scale >= 3} className="hover:bg-black/50 hover:text-white"><ZoomIn /></Button>
            </div>
            <DialogClose className="absolute top-2 right-2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white">
                <X className="h-6 w-6" />
            </DialogClose>
        </DialogContent>
    )
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('id');
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
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

  const handlePhotoRemove = async (photoUrl: string) => {
    if (!currentUser) return;
    setIsDeleting(photoUrl);
    try {
      const result = await removeProfilePicture(currentUser.uid, photoUrl);
      if (result.success) {
        setProfile(prev => {
          if (!prev) return null;
          const newPictures = (prev.profilePictures || []).filter((p: string) => p !== photoUrl);
          return { ...prev, profilePictures: newPictures };
        });
        toast({
          title: "Photo supprimée !",
          description: "Votre photo a été retirée de votre profil.",
        });
      } else {
        throw new Error(result.error || "La suppression de la photo a échoué.");
      }
    } catch (error) {
      console.error("Failed to remove profile picture:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: errorMessage,
      });
    } finally {
      setIsDeleting(null);
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
  
  const handleBlockUser = () => {
    // Logic to block user
    toast({ title: `${profile?.firstName} a été bloqué(e).` });
  };

  const handleReportUser = () => {
    // Logic to report user
    toast({ title: `Le profil de ${profile?.firstName} a été signalé.` });
  };
  
  const handleAddFriend = () => {
    // Placeholder logic to add a friend
    toast({ title: 'Demande envoyée !', description: `Votre demande d'ami à ${profile?.firstName} a été envoyée.` });
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
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">Profil non trouvé</h2>
            <p className="text-muted-foreground">Impossible de charger les informations de ce profil.</p>
            <Button onClick={() => router.push('/')} className="mt-4">Retour à l'accueil</Button>
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
  
  const destinationCountry = countries.find(c => c.name === profile.destination);
  const locationCountry = countries.find(c => c.name === profile.location);
  const travelStyleOption = travelStyles.find(s => s.value === profile.travelStyle);
  const travelActivityOption = travelActivities.find(a => a.value === profile.activities);
  const intention = profile.intention ? intentionMap[profile.intention] : null;


  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/30">
        <header className="fixed top-0 left-0 z-30 w-full p-2">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-9 w-9 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>
        <main className={cn("flex-1", isOwner ? "pb-4" : "pb-24")}>
             <div className="w-full bg-background md:py-4">
                {profilePictures.length > 0 ? (
                    <Dialog>
                        <Carousel
                            className="w-full max-w-4xl mx-auto"
                             opts={{
                                align: "center",
                                loop: profilePictures.length > 1,
                            }}
                            plugins={profilePictures.length > 1 ? [
                                Autoplay({
                                  delay: 5000,
                                  stopOnInteraction: true,
                                }),
                            ] : []}
                        >
                            <CarouselContent className="-ml-1 md:-ml-4">
                                {profilePictures.map((src: string, index: number) => (
                                    <CarouselItem key={index} className="pl-1 md:pl-4 basis-1/2 md:basis-[43%]">
                                        <DialogTrigger asChild>
                                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg md:rounded-2xl group cursor-pointer">
                                                <Image 
                                                    src={src}
                                                    alt={`Photo de profil de ${profile.firstName} ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </DialogTrigger>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <PhotoViewer images={profilePictures} startIndex={0} />
                    </Dialog>
                ) : (
                     <div className="flex h-48 md:h-64 w-full items-center justify-center bg-card">
                         {isOwner ? (
                             <Button 
                                variant="outline" 
                                className="h-24 w-24 rounded-full border-dashed border-2 flex-col gap-1"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <PlusCircle className="h-8 w-8 text-muted-foreground" />}
                                <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                            </Button>
                         ) : (
                             <Camera className="h-16 w-16 text-muted-foreground" />
                         )}
                    </div>
                )}
                 <div className="px-2 py-2 md:px-4 md:pt-4">
                     <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-bold font-headline">{profile.firstName}, {profile.age}</h1>
                                {isOwner && (
                                    <Link href={`/profile/edit?id=${profileId}`} passHref>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 md:h-9 md:w-9" asChild>
                                            <div>
                                                <Edit className="h-4 w-4 md:h-5 md:w-5" />
                                                <span className="sr-only">Modifier le profil</span>
                                            </div>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                                {locationCountry && <span className={`fi fi-${locationCountry.code.toLowerCase()} mr-1`}></span>}
                                <span>{profile.location}</span>
                            </div>
                        </div>
                        
                        {!isOwner && (
                             <Drawer>
                                <DrawerTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 md:h-9 md:w-9 -mr-2">
                                        <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <div className="mx-auto w-full max-w-sm">
                                        <DrawerHeaderComponent>
                                            <DrawerTitle>Options</DrawerTitle>
                                            <DrawerDescriptionComponent>Gérez votre interaction avec ce profil.</DrawerDescriptionComponent>
                                        </DrawerHeaderComponent>
                                        <div className="p-4 pb-0">
                                            <div className="mt-3 h-full">
                                                <DrawerClose asChild>
                                                    <Button variant="outline" className="w-full justify-start p-4 h-auto text-base" onClick={handleBlockUser}>
                                                        <Ban className="mr-2 h-5 w-5" /> Bloquer
                                                    </Button>
                                                </DrawerClose>
                                                <div className="my-2 border-t"></div>
                                                <DrawerClose asChild>
                                                    <Button variant="outline" className="w-full justify-start p-4 h-auto text-base" onClick={handleReportUser}>
                                                        <ShieldAlert className="mr-2 h-5 w-5" /> Signaler un abus
                                                    </Button>
                                                </DrawerClose>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                             <DrawerClose asChild>
                                                <Button variant="secondary" className="w-full h-12 text-base">Annuler</Button>
                                            </DrawerClose>
                                        </div>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        )}

                         <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoAdd}
                            disabled={isUploading || profilePictures.length >= MAX_PHOTOS}
                        />
                    </div>
                    {intention && (
                        <div className="mt-2">
                            <Badge variant="default" className={cn("border-none text-white text-xs px-2 py-0.5 h-auto", intention.color)}>
                                <intention.icon className="mr-1 h-3 w-3" />
                                {intention.text}
                            </Badge>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-2 md:px-4 space-y-2 mt-2 md:mt-0 md:bg-transparent bg-background md:pt-2">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                     <div className="md:col-span-2 space-y-2">
                        <Card className="shadow-none md:shadow-lg">
                            <CardHeader className="p-3 md:p-6">
                                <CardTitle className="text-base md:text-2xl">Ma description</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                                <p className="text-xs md:text-sm text-muted-foreground">{profile.bio || "Aucune description fournie."}</p>
                            </CardContent>
                        </Card>
                         <Card className="shadow-none md:shadow-lg">
                            <CardHeader className="p-3 md:p-6">
                                <CardTitle className="text-base md:text-2xl">Mon Prochain Voyage</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs md:text-sm p-3 pt-0 md:p-6 md:pt-0">
                                <div className="flex items-start gap-2">
                                    <Plane className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Destination</p>
                                        <p className="text-muted-foreground text-xs md:text-sm flex items-center gap-2">
                                            {destinationCountry && <span className={`fi fi-${destinationCountry.code.toLowerCase()}`}></span>}
                                            {profile.destination}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Dates</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{travelDates}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Backpack className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Style de voyage</p>
                                        <p className="text-muted-foreground text-xs md:text-sm flex items-center gap-2">
                                           {travelStyleOption?.icon && <span className="text-sm">{travelStyleOption.icon}</span>}
                                           {profile.travelStyle}
                                        </p>
                                    </div>
                                </div>
                                {profile.activities && profile.activities !== 'Toutes' && (
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-[10px] md:text-xs">Activités prévues</p>
                                            <p className="text-muted-foreground text-xs md:text-sm flex items-center gap-2">
                                                {travelActivityOption?.icon && <span className="text-sm">{travelActivityOption.icon}</span>}
                                                {profile.activities}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <Card className="shadow-none md:shadow-lg">
                             <CardHeader className="p-3 md:p-6">
                                <CardTitle className="text-base md:text-2xl">Détails</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs md:text-sm p-3 pt-0 md:p-6 md:pt-0">
                                <div className="flex items-start gap-2">
                                    <Languages className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Langues parlées</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.languages.join(', ')}</p>
                                    </div>
                                </div>
                                {profile.height && (
                                <div className="flex items-start gap-2">
                                    <Ruler className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Taille</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.height} cm</p>
                                    </div>
                                </div>
                                )}
                                {profile.weight && (
                                <div className="flex items-start gap-2">
                                    <Scale className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Poids</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.weight} kg</p>
                                    </div>
                                </div>
                                )}
                                 <div className="flex items-start gap-2">
                                    <Cigarette className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Tabac</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.tobacco || 'Non spécifié'}</p>
                                    </div>
                                </div>
                                 <div className="flex items-start gap-2">
                                    <Wine className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Alcool</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.alcohol || 'Non spécifié'}</p>
                                    </div>
                                </div>
                                {profile.cannabis && (
                                <div className="flex items-start gap-2">
                                    <CannabisIcon className="h-3 w-3 md:h-4 md:w-4 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[10px] md:text-xs">Cannabis</p>
                                        <p className="text-muted-foreground text-xs md:text-sm">{profile.cannabis}</p>
                                    </div>
                                </div>
                                )}
                            </CardContent>
                        </Card>
                        {isOwner && (
                            <div className="flex justify-center py-2">
                                <Button variant="outline" size="sm" onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Se déconnecter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
        {!isOwner && profileId && (
            <div className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-background/80 backdrop-blur-sm border-t">
                <div className="flex gap-4">
                     <Button size="lg" className="flex-1" variant="outline" onClick={handleAddFriend}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Ajouter
                    </Button>
                    <Link href={`/chat/${profileId}`} passHref className="flex-1">
                        <Button size="lg" className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer un message
                        </Button>
                    </Link>
                </div>
            </div>
        )}
    </div>
  );
}
