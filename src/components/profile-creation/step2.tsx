
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUserProfile } from '@/lib/firebase-actions';
import { useToast } from '@/components/ui/toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';


const profileStep2Schema = z.object({
  travelStyle: z.string().min(1, "Le style de voyage est requis."),
  destination: z.string().min(1, "La destination est requise."),
  languages: z.string().min(1, "Au moins une langue est requise."),
  bio: z.string().min(20, "La biographie doit contenir au moins 20 caractères.").max(500, "La biographie ne peut pas dépasser 500 caractères."),
  intention: z.enum(['explore', 'friendship', 'romance', 'mix'], { required_error: "Veuillez sélectionner une intention." }),
});


export default function ProfileStep2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof profileStep2Schema>>({
    resolver: zodResolver(profileStep2Schema),
    defaultValues: {
      travelStyle: '',
      destination: '',
      languages: '',
      bio: '',
      intention: 'mix',
    },
  });

  const onSubmit = (values: z.infer<typeof profileStep2Schema>) => {
    startTransition(async () => {
      const uid = searchParams.get('uid');
      if (!uid) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Une erreur est survenue, veuillez réessayer.',
        });
        return;
      }
      try {
        const profileData = {
          ...values,
          languages: values.languages.split(',').map(lang => lang.trim()),
          travelIntention: values.intention,
        };
        await updateUserProfile(uid, profileData);
        toast({
          title: 'Profil mis à jour',
          description: 'Votre profil a été complété avec succès.',
        });
        router.push('/'); // Redirect to home/dashboard
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Échec de la mise à jour',
          description: 'Impossible de sauvegarder vos informations. Veuillez réessayer.',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Complétez votre profil</CardTitle>
        <CardDescription>Dites-en plus sur vos aventures.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="travelStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style de voyage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="backpack">Backpacker</SelectItem>
                      <SelectItem value="luxury">Luxe</SelectItem>
                      <SelectItem value="adventure">Aventure</SelectItem>
                      <SelectItem value="culture">Culturel</SelectItem>
                      <SelectItem value="relax">Détente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prochaine destination de rêve</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tokyo, Japon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langues parlées</FormLabel>
                  <FormControl>
                    <Input placeholder="Français, Anglais, Espagnol..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre biographie</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez-vous en quelques mots..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intention"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Que recherchez-vous ?</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une intention" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="explore">Explorer ensemble</SelectItem>
                      <SelectItem value="friendship">Amitié et voyage</SelectItem>
                      <SelectItem value="romance">Partenaire de voyage romantique</SelectItem>
                       <SelectItem value="mix">Ouvert à tout</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Terminer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
