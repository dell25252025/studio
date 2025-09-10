
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ArrowLeft, Loader2, Save, Mail, KeyRound, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const emailSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.'),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'L\'ancien mot de passe est requis.'),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

export default function AccountSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
       if (!user) {
        router.push('/signup');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentUser?.email || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (currentUser?.email) {
      emailForm.setValue('email', currentUser.email);
    }
  }, [currentUser, emailForm]);
  
  const handleEmailUpdate = async (data: z.infer<typeof emailSchema>) => {
    if (!currentUser) return;
    setIsEmailSubmitting(true);
    try {
      await updateEmail(currentUser, data.email);
      toast({
        title: 'Succès',
        description: 'Votre adresse e-mail a été mise à jour.',
      });
    } catch (error: any) {
      console.error(error);
      let description = "Une erreur est survenue.";
      if (error.code === 'auth/requires-recent-login') {
        description = "Cette action nécessite une reconnexion récente. Veuillez vous déconnecter et vous reconnecter.";
      }
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description,
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (data: z.infer<typeof passwordSchema>) => {
    if (!currentUser || !currentUser.email) return;
    setIsPasswordSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, data.oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      await updatePassword(currentUser, data.newPassword);

      passwordForm.reset();
      setIsPasswordFormVisible(false);
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été mis à jour.',
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      let description = "Une erreur est survenue lors de la mise à jour.";
      
      if (error.code === 'auth/requires-recent-login') {
        description = "Cette action nécessite une reconnexion récente. Veuillez vous déconnecter et vous reconnecter.";
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        description = "L'ancien mot de passe est incorrect. Veuillez réessayer.";
        passwordForm.setError('oldPassword', { type: 'manual', message: 'Mot de passe incorrect.' });
      }

      toast({
        variant: 'destructive',
        title: 'Échec de la mise à jour du mot de passe',
        description,
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pt-12">
      <main className="space-y-6 px-2 py-4 md:px-4">
            <div className="mx-auto max-w-2xl space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Adresse e-mail</CardTitle>
                        <CardDescription>Gérez l'adresse e-mail associée à votre compte.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(handleEmailUpdate)} className="space-y-4">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="votre@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isEmailSubmitting}>
                                    {isEmailSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enregistrer l'e-mail
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Mot de passe</CardTitle>
                        <CardDescription>Modifiez votre mot de passe régulièrement pour plus de sécurité.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isPasswordFormVisible ? (
                        <Button onClick={() => setIsPasswordFormVisible(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Changer le mot de passe
                        </Button>
                      ) : (
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ancien mot de passe</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nouveau mot de passe</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                                            <FormControl><Input type="password" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                  <Button type="submit" disabled={isPasswordSubmitting}>
                                      {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Enregistrer le mot de passe
                                  </Button>
                                   <Button variant="ghost" onClick={() => setIsPasswordFormVisible(false)} disabled={isPasswordSubmitting}>
                                      Annuler
                                   </Button>
                                </div>
                            </form>
                        </Form>
                      )}
                    </CardContent>
                </Card>

                 <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sécurité du compte</AlertTitle>
                  <AlertDescription>
                    Pour des raisons de sécurité, la modification de votre e-mail ou de votre mot de passe peut nécessiter une déconnexion et une reconnexion récentes.
                  </AlertDescription>
                </Alert>
            </div>
        </main>
    </div>
  );
}
