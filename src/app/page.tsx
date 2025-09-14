
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { onAuthStateChanged, type User, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

// Original Home Page Imports
import { type AIPoweredMatchingInput } from '@/ai/flows/ai-powered-matching';
import { handleAiMatching } from '@/app/actions';
import { currentUser, possibleMatches } from '@/lib/mock-data';
import AiMatchResults from '@/components/ai-match-results';
import MatchCarousel from '@/components/match-carousel';
import BottomNav from '@/components/bottom-nav';
import WanderlinkHeader from '@/components/wanderlink-header';

// Auth Page Imports
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Plane } from 'lucide-react';
import Link from 'next/link';

// Combined schemas for Auth
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

// --- Main Component --- //

export default function ConditionalHome() {
  const [currentUserAuth, setCurrentUserAuth] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserAuth(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUserAuth) {
    return <DiscoverPage user={currentUserAuth} />;
  }

  return <AuthPage />;
}

// --- Sub-component for Authenticated Users --- //

function DiscoverPage({ user }: { user: User }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('discover');
  const { toast } = useToast();

  const runAiMatching = async () => {
    setLoading(true);
    setView('results');
    try {
      const res = await handleAiMatching({ userProfile: currentUser, possibleMatches });
      setResults(res);
    } catch (error) {
      console.error("Failed to get AI matches:", error);
      toast({ variant: 'destructive', title: 'AI Matching Error' });
    } finally {
      setLoading(false);
    }
  };

  const resetView = () => {
    setView('discover');
    setResults([]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <WanderlinkHeader />
      <main className="flex-1 pb-24 pt-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            {view === 'discover' && (
              <>
                <div>
                  <MatchCarousel profiles={possibleMatches} />
                </div>
                <div className="mt-8">
                   <Button onClick={runAiMatching} disabled={loading} size="lg" className="rounded-full font-bold">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Find my AI Match
                  </Button>
                </div>
              </>
            )}

            {view === 'results' && loading && (
              <div className="flex flex-col items-center justify-center text-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <h2 className="mt-6 text-2xl font-semibold">Finding your perfect match...</h2>
                  <p className="mt-2 text-muted-foreground">Our AI is analyzing profiles to find the best travel partners for you.</p>
              </div>
            )}

            {view === 'results' && !loading && results.length > 0 && (
              <AiMatchResults results={results} profiles={possibleMatches} onReset={resetView} />
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}


// --- Sub-component for Unauthenticated Users --- //

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema | typeof signupSchema>) {
    setIsLoading(true);
    if (isLogin) {
      try {
        const loginValues = values as z.infer<typeof loginSchema>;
        await signInWithEmailAndPassword(auth, loginValues.email, loginValues.password);
        toast({ title: 'Connexion réussie !', description: 'Heureux de vous revoir.' });
        router.push('/'); // Will re-render and show DiscoverPage
      } catch (error) {
        const errorMessage = error instanceof FirebaseError ? error.message : "Email ou mot de passe incorrect.";
        toast({ variant: 'destructive', title: 'Erreur de connexion', description: errorMessage });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const signupValues = values as z.infer<typeof signupSchema>;
        await createUserWithEmailAndPassword(auth, signupValues.email, signupValues.password);
        toast({ title: 'Compte créé avec succès !', description: 'Vous pouvez maintenant compléter votre profil.' });
        router.push('/create-profile');
      } catch (error) {
         let description = "Une erreur inattendue s'est produite.";
         if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
           description = "Un compte existe déjà avec cette adresse e-mail.";
         }
         toast({ variant: 'destructive', title: 'Erreur de création de compte', description });
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
       toast({ title: 'Connexion réussie !', description: 'Bienvenue sur WanderLink.' });
       // After login, the main component will redirect to the correct page.
       // We might just need to force a re-render or redirect to '/', 
       // which will then show the discover page.
       router.push('/'); 
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite.";
       toast({ variant: 'destructive', title: 'Erreur de connexion Google', description: errorMessage });
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
                <h1 className="text-3xl font-bold font-logo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="nom@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Mot de passe</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>)} />
            {!isLogin && (<FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirmer le mot de passe</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
            <Button type="submit" className="w-full !mt-5" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : "Créer un compte"}
            </Button>
          </form>
        </Form>
        <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Ou</span></div></div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
          {isGoogleLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C322.3 103.6 289.4 88 248 88c-73.2 0-133.1 59.9-133.1 133.1s59.9 133.1 133.1 133.1c76.9 0 115.7-53.5 119.7-81.6H248V261.8h239.1c.9 21.9 1.9 43.7 1.9 66.2z"></path></svg>)}
          Continuer avec Google
        </Button>
        <div className="mt-4 text-center">
           {isLogin ? (<Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={toggleForm}>Pas encore de compte ? Créez-en un</Button>) : (<Button variant="link" className="text-muted-foreground" onClick={toggleForm}>Vous avez déjà un compte ? Connectez-vous</Button>)}
        </div>
      </div>
    </div>
  );
}
