
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plane, Trash2, UploadCloud, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getUserProfile, updateUserProfile, addProfilePicture, removeProfilePicture } from '@/app/actions';
import { formSchema, type FormData } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';

const MAX_PHOTOS = 4;

const allLanguages = [
    { id: 'fr', label: 'Français' }, { id: 'en', label: 'Anglais' }, { id: 'es', label: 'Espagnol' },
    { id: 'ar', label: 'Arabe' }, { id: 'zh', label: 'Mandarin' }, { id: 'hi', label: 'Hindi' },
    { id: 'bn', label: 'Bengali' }, { id: 'pt', label: 'Portugais' }, { id: 'ru', label: 'Russe' },
    { id: 'ja', label: 'Japonais' }, { id: 'de', label: 'Allemand' }, { id: 'jv', label: 'Javanais' },
    { id: 'ko', label: 'Coréen' }, { id: 'te', label: 'Télougou' }, { id: 'mr', label: 'Marathi' },
    { id: 'tr', label: 'Turc' }, { id: 'ta', label: 'Tamoul' }, { id: 'vi', label: 'Vietnamien' },
    { id: 'ur', label: 'Ourdou' }, { id: 'it', label: 'Italien' }, { id: 'th', label: 'Thaï' },
    { id: 'gu', label: 'Gujarati' }, { id: 'fa', label: 'Persan' }, { id: 'pl', label: 'Polonais' },
    { id: 'uk', label: 'Ukrainien' }, { id: 'ro', label: 'Roumain' }, { id: 'nl', label: 'Néerlandais' },
    { id: 'el', label: 'Grec' }, { id: 'sv', label: 'Suédois' }, { id: 'he', label: 'Hébreu' },
];

const activities = [
    { id: 'hiking', label: 'Randonnée' }, { id: 'beach', label: 'Plage' }, { id: 'museums', label: 'Musées' },
    { id: 'concerts', label: 'Concerts / Festivals' }, { id: 'food', label: 'Gastronomie' },
    { id: 'nightlife', label: 'Sorties nocturnes' }, { id: 'shopping', label: 'Shopping' },
    { id: 'yoga', label: 'Yoga / Méditation' }, { id: 'sport', label: 'Sport' },
];

export default function EditProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const profileId = searchParams.get('id');
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { profilePictures: [] },
    });

    const { control, handleSubmit, setValue, getValues, watch } = methods;
    const profilePictures = watch('profilePictures') || [];
    const areDatesFlexible = watch('flexibleDates');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.uid === profileId) {
                setCurrentUser(user);
                const fetchProfile = async () => {
                    try {
                        const profileData = await getUserProfile(user.uid);
                        if (profileData) {
                            Object.entries(profileData).forEach(([key, value]) => {
                                if (key === 'dates' && value) {
                                    setValue('dates', {
                                        from: value.from ? new Date(value.from) : undefined,
                                        to: value.to ? new Date(value.to) : undefined,
                                    });
                                } else if (key === 'sex') {
                                    setValue('gender', value);
                                } else {
                                    setValue(key as keyof FormData, value);
                                }
                            });
                        }
                    } catch (error) {
                       console.error("Failed to fetch profile:", error);
                    }
                };
                fetchProfile();
            } else {
                router.push('/signup');
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, [router, profileId, setValue]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !currentUser) return;
        setIsUploading(true);

        const uploadPromises = Array.from(files).slice(0, MAX_PHOTOS - profilePictures.length).map(file => {
             return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const result = await addProfilePicture(currentUser.uid, e.target?.result as string);
                        if (result.success && result.url) {
                            resolve(result.url);
                        } else {
                            reject(new Error(result.error || 'Upload failed'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            setValue('profilePictures', [...profilePictures, ...uploadedUrls], { shouldValidate: true });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur d'upload", description: "Une photo n'a pas pu être ajoutée." });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removePicture = async (urlToRemove: string) => {
        if (!currentUser) return;
        try {
            await removeProfilePicture(currentUser.uid, urlToRemove);
            setValue('profilePictures', profilePictures.filter(url => url !== urlToRemove), { shouldValidate: true });
            toast({ title: "Photo supprimée" });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer la photo." });
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            const result = await updateUserProfile(currentUser.uid, data);
            if (!result.success) throw new Error(result.error);
            toast({ title: 'Profil mis à jour avec succès !' });
            router.push(`/profile?id=${currentUser.uid}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
            toast({ variant: 'destructive', title: 'Erreur de mise à jour', description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-background text-foreground p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                             <Plane className="h-8 w-8 text-primary" />
                             <h1 className="text-3xl font-bold font-headline text-primary">Modifier le Profil</h1>
                        </div>
                        <Link href={`/profile?id=${profileId}`} passHref>
                            <Button variant="ghost" size="icon"><X className="h-6 w-6" /><span className="sr-only">Annuler</span></Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Section Informations Personnelles */}
                        <div className="p-6 border rounded-lg space-y-4">
                            <h2 className="text-xl font-semibold">Informations Personnelles</h2>
                            <FormField control={control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={control} name="age" render={({ field }) => (<FormItem><FormLabel>Âge</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={control} name="gender" render={({ field }) => (<FormItem><FormLabel>Genre</FormLabel><RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Homme" /></FormControl><FormLabel>Homme</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Femme" /></FormControl><FormLabel>Femme</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Non-binaire" /></FormControl><FormLabel>Non-binaire</FormLabel></FormItem></RadioGroup><FormMessage /></FormItem>)} />
                            <FormField control={control} name="height" render={({ field }) => (<FormItem><FormLabel>Taille (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="Ex: 175" onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={control} name="weight" render={({ field }) => (<FormItem><FormLabel>Poids (kg)</FormLabel><FormControl><Input type="number" {...field} placeholder="Ex: 70" onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={control} name="bio" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        {/* Section Photos */}
                        <div className="p-6 border rounded-lg space-y-4">
                            <h2 className="text-xl font-semibold">Mes Photos</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {profilePictures.map((src, index) => (
                                    <div key={index} className="relative aspect-square">
                                        <Image src={src} alt={`Photo ${index + 1}`} fill className="object-cover rounded-md" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removePicture(src)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                                {profilePictures.length < MAX_PHOTOS && (
                                    <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-muted" onClick={() => fileInputRef.current?.click()}>
                                        <div className="text-center text-muted-foreground">{isUploading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : <><UploadCloud className="h-8 w-8 mx-auto" /><span className="text-sm mt-2">Ajouter</span></>}</div>
                                    </div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileSelect} disabled={isUploading} />
                        </div>
                        
                         {/* Section Style de Vie */}
                        <div className="p-6 border rounded-lg space-y-4">
                            <h2 className="text-xl font-semibold">Style de Vie</h2>
                            <FormField control={control} name="tobacco" render={({ field }) => (<FormItem><FormLabel>Tabac</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Non-fumeur">Non-fumeur</SelectItem><SelectItem value="Occasionnellement">Occasionnellement</SelectItem><SelectItem value="Régulièrement">Régulièrement</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={control} name="alcohol" render={({ field }) => (<FormItem><FormLabel>Alcool</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Jamais">Jamais</SelectItem><SelectItem value="Occasionnellement">Occasionnellement</SelectItem><SelectItem value="Souvent">Souvent</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={control} name="cannabis" render={({ field }) => (<FormItem><FormLabel>Cannabis</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une option" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Non-fumeur">Non-fumeur</SelectItem><SelectItem value="Occasionnellement">Occasionnellement</SelectItem><SelectItem value="Régulièrement">Régulièrement</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>

                         {/* Section Voyage */}
                         <div className="p-6 border rounded-lg space-y-4">
                             <h2 className="text-xl font-semibold">Mon Prochain Voyage</h2>
                             <FormField control={control} name="destination" render={({ field }) => (<FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={control} name="dates" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Dates</FormLabel><Popover><PopoverTrigger asChild><Button variant="outline" className={cn(!field.value?.from && !areDatesFlexible && "text-muted-foreground")} disabled={areDatesFlexible}><CalendarIcon className="mr-2 h-4 w-4" />{areDatesFlexible ? 'Dates flexibles' : field.value?.from ? (field.value.to ? `${format(field.value.from, 'd LLL y', { locale: fr })} - ${format(field.value.to, 'd LLL y', { locale: fr })}` : format(field.value.from, 'd LLL y', { locale: fr })) : 'Choisissez une période'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar initialFocus mode="range" selected={field.value as DateRange} onSelect={field.onChange} numberOfMonths={2} locale={fr} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                             <FormField control={control} name="flexibleDates" render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Mes dates sont flexibles</FormLabel></FormItem>)} />
                             <FormField control={control} name="travelStyle" render={({ field }) => (<FormItem><FormLabel>Style de voyage</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Aventure / Sac à dos">Aventure / Sac à dos</SelectItem><SelectItem value="Luxe / Détente">Luxe / Détente</SelectItem><SelectItem value="Culturel / Historique">Culturel / Historique</SelectItem><SelectItem value="Festif / Événementiel">Festif / Événementiel</SelectItem><SelectItem value="Religieux / Spirituel">Religieux / Spirituel</SelectItem><SelectItem value="Road Trip / Van Life">Road Trip / Van Life</SelectItem><SelectItem value="Humanitaire / Écovolontariat">Humanitaire / Écovolontariat</SelectItem><SelectItem value="Autre">Autre</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={control} name="activities" render={() => (<FormItem><FormLabel className="text-base">J'aimerais faire...</FormLabel><div className="grid grid-cols-2 gap-4">{activities.map((item) => (<FormField key={item.id} control={control} name="activities" render={({ field }) => { return (<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange( field.value?.filter( (value: string) => value !== item.id ) ) }} /></FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>)}}/>))}</div><FormMessage /></FormItem>)} />
                             <FormField control={control} name="financialArrangement" render={({ field }) => (<FormItem><FormLabel>Intention</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Partager les frais (50/50)">Partager les frais (50/50)</SelectItem><SelectItem value="Je peux sponsoriser le voyage">Je peux sponsoriser le voyage</SelectItem><SelectItem value="Je cherche un voyage sponsorisé">Je cherche un voyage sponsorisé</SelectItem><SelectItem value="Organiser un voyage de groupe">Organiser un voyage de groupe</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                         </div>

                        <div className="flex justify-end pt-8">
                            <Button type="submit" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sauvegarde...</> : <><Save className="mr-2 h-4 w-4" />Sauvegarder les modifications</>}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
