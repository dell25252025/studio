
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(1, { message: 'Le mot de passe est obligatoire.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Adresse e-mail invalide.' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof signupSchema>) {
    setIsLoading(true);
    if (isLogin) {
      // Handle Login
      try {
        const loginValues = values as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, loginValues.email, loginValues.password);
        toast({
          title: 'Connexion réussie !',
          description: 'Heureux de vous revoir.',
        });
        router.push('/');
      } catch (error) {
        console.error('Login error', error);
        const errorMessage = error instanceof FirebaseError ? error.message : "Email ou mot de passe incorrect.";
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle Sign Up
      try {
        const signupValues = values as z.infer<typeof signupSchema>;
        await createUserWithEmailAndPassword(auth, signupValues.email, signupValues.password);
        toast({
          title: 'Compte créé avec succès !',
          description: 'Vous pouvez maintenant compléter votre profil.',
        });
        router.push('/create-profile');
      } catch (error) {
         console.error('Sign up error', error);
         let description = "Une erreur inattendue s'est produite. Veuillez réessayer.";
         if (error instanceof FirebaseError) {
             if (error.code === 'auth/email-already-in-use') {
                 description = "Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter.";
                 toast({
                     variant: 'destructive',
                     title: 'Compte existant',
                     description: description,
                 });
             } else {
                 description = error.message;
                 toast({
                     variant: 'destructive',
                     title: 'Erreur de création de compte',
                     description: description,
                 });
             }
         } else {
              toast({
                  variant: 'destructive',
                  title: 'Erreur de création de compte',
                  description: description,
              });
         }
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
       toast({
        title: 'Connexion réussie !',
        description: 'Bienvenue sur WanderLink.',
      });
      // Redirect to profile creation if they are a new user, or home if they exist.
      // For simplicity, we'll always redirect to create-profile, Firestore rules will prevent overwriting.
      router.push('/create-profile');
    } catch (error) {
       console.error('Google sign in error', error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite.";
       toast({
        variant: 'destructive',
        title: 'Erreur de connexion Google',
        description: errorMessage,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    form.reset();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
            <Link href="/" className="flex items-center gap-2">
                <h1 className="text-3xl font-bold font-headline text-primary">
                    WanderLink
                </h1>
            </Link>
        </div>
        <h2 className="text-xl font-semibold text-center">{isLogin ? 'Connectez-vous' : 'Créez votre compte'}</h2>
        <p className="text-center text-sm text-muted-foreground mb-4">
          {isLogin ? 'Heureux de vous revoir !' : 'Rejoignez la communauté de voyageurs.'}
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nom@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isLogin && (
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full !mt-5" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : "Créer un compte"}
            </Button>
          </form>
        </Form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C322.3 103.6 289.4 88 248 88c-73.2 0-133.1 59.9-133.1 133.1s59.9 133.1 133.1 133.1c76.9 0 115.7-53.5 119.7-81.6H248V261.8h239.1c.9 21.9 1.9 43.7 1.9 66.2z"></path></svg>
          )}
          Continuer avec Google
        </Button>
        
        <div className="mt-4 text-center">
           {isLogin ? (
                <Button 
                    variant="default"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={toggleForm}>
                    Pas encore de compte ? Créez-en un
                </Button>
            ) : (
                <Button
                    variant="link"
                    className="text-muted-foreground"
                    onClick={toggleForm}
                >
                    Vous avez déjà un compte ? Connectez-vous
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
