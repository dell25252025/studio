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
import { Loader2, Sparkles, Plane, Mail } from 'lucide-react';
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


// --- Sub-component for Unauthenticated Users (with Responsive Layout) --- //

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);

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
        router.push('/');
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
    <div className="relative min-h-screen bg-background">
      {/* Background Video & Overlay */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src="https://ik.imagekit.io/fip3ktm2p/545556555_24610768548534823_5832326088093088554_n.mp4?updatedAt=1757753813634"
            type="video/mp4"
          />
        </video>
        <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 grid min-h-screen md:grid-cols-2">
        {/* Left Side: Brand & Slogan (Desktop Only) */}
        <div className="hidden md:flex flex-col justify-center p-12 lg:p-16">
           <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-bold font-logo text-transparent mb-4">
              WanderLink
           </h1>
           <p className="text-xl text-white/80">
              Trouvez des compagnons de voyage qui partagent votre passion. Votre prochaine grande aventure commence ici.
           </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-lg bg-transparent p-4 md:bg-background/80 md:p-6 md:shadow-2xl md:backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-center gap-2 md:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold font-logo text-transparent">
                        WanderLink
                    </h1>
                </Link>
            </div>
            <h2 className="text-center text-xl font-semibold">{isLogin ? 'Connectez-vous' : 'Créez votre compte'}</h2>
            <p className="text-center text-sm text-muted-foreground mb-4">
            {isLogin ? 'Heureux de vous revoir !' : 'Rejoignez la communauté de voyageurs.'}
            </p>
            
            <div className="flex flex-col">
                {/* Bouton Google : order-1 sur mobile, order-3 sur desktop */}
                <div className="order-1 md:order-3">
                    <Button variant="outline" className="w-full bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                        {isGoogleLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2 h-5 w-5">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                        )}
                        Continuer avec Google
                    </Button>
                </div>
                
                {/* Séparateur : order-2 sur mobile et desktop */}
                <div className="order-2 md:order-2">
                    <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-muted-foreground">Ou</span></div></div>
                </div>

                {/* Formulaire Email/Mdp : order-3 sur mobile, order-1 sur desktop */}
                <div className="order-3 md:order-1">
                    {/* Affiche le formulaire sur desktop, ou sur mobile si isEmailFormVisible est true */}
                    <div className={`w-full ${isEmailFormVisible ? 'block' : 'hidden'} md:block`}>
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
                    </div>
                    {/* Affiche le bouton "S'inscrire" uniquement sur mobile si le formulaire est caché */}
                    <div className={`w-full ${isEmailFormVisible ? 'hidden' : 'block'} md:hidden`}>
                        <Button variant="outline" className="w-full" onClick={() => { setIsEmailFormVisible(true); setIsLogin(false); form.reset(); }}>
                            <Mail className="mr-2 h-4 w-4" />
                            S'inscrire avec E-mail
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                 {/* Affiche le toggle normal sur desktop ou si le formulaire est visible sur mobile*/}
                <div className={`w-full ${isEmailFormVisible ? 'block' : 'hidden'} md:block`}>
                    {isLogin ? (<Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={toggleForm}>Pas encore de compte ? Créez-en un</Button>) : (<Button variant="link" className="text-muted-foreground" onClick={toggleForm}>Vous avez déjà un compte ? Connectez-vous</Button>)}
                </div>
                {/* Affiche le lien "Se connecter" uniquement sur mobile si le formulaire est caché */}
                <div className={`w-full ${isEmailFormVisible ? 'hidden' : 'block'} md:hidden`}>
                     <Button variant="link" className="text-muted-foreground" onClick={() => { setIsEmailFormVisible(true); setIsLogin(true); form.reset(); }}>
                        Déjà un compte ? Connectez-vous
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
