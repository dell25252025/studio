
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
import { Loader2 } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/useIsMobile';

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

const desktopVideoUrl = "https://ik.imagekit.io/fip3ktm2p/545556555_24610768548534823_5832326088093088554_n.mp4?updatedAt=1757753813634";
const mobileVideoUrl = "https://ik.imagekit.io/fip3ktm2p/video%20app2.mp4?updatedAt=1757957531301";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  const isMobile = useIsMobile();

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

  const resetAuthState = () => {
    setIsEmailFormVisible(false);
    form.reset();
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source
            src={isMobile ? mobileVideoUrl : desktopVideoUrl}
            type="video/mp4"
          />
        </video>
        <div className="absolute top-0 left-0 h-full w-full bg-black/30" />
      </div>

      <div className="relative z-10">
        <div className="grid min-h-screen items-center md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-center p-12 lg:p-16">
            <h1 className="text-6xl font-bold font-logo text-white mb-4">
                WanderLink
            </h1>
            <p className="text-xl text-white">
                Trouvez des compagnons de voyage qui partagent votre passion. Votre prochaine grande aventure commence ici.
            </p>
            </div>

            <div className="flex flex-col h-screen p-4 md:items-center md:justify-center md:h-auto">
                <div className="text-center md:hidden pt-2 flex-shrink-0">
                    <button onClick={resetAuthState} className="flex w-full justify-center items-center gap-2 bg-transparent border-none p-0" aria-label="Retour à l'accueil de l'authentification">
                        <h1 className="text-2xl font-bold font-logo text-white">
                            WanderLink
                        </h1>
                    </button>
                </div>
            
                <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto">
                    <p className="mt-1 text-[0.8rem] text-white px-4 leading-tight text-center md:hidden mb-8">
                        Trouvez des compagnons de voyage qui partagent votre passion.
                    </p>
                    <div className="w-full">
                        <div className="hidden md:block text-center mb-4">
                            <h2 className="text-xl font-semibold text-white">{isLogin ? 'Connectez-vous' : 'Créez votre compte'}</h2>
                            <p className="text-sm text-white/90">
                            {isLogin ? 'Heureux de vous revoir !' : 'Rejoignez la communauté de voyageurs.'}
                            </p>
                        </div>

                        <div className={`flex flex-col gap-4 ${isEmailFormVisible ? 'hidden' : 'block'} mt-auto mb-10`}>
                            <div className="text-center">
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
                                <p className="mt-1 text-[9px] text-white md:hidden">
                                    Nous ne publions jamais rien sur vos comptes de réseaux sociaux
                                </p>
                            </div>

                            <div className="relative hidden md:flex items-center"><div className="w-full border-t border-white/30" /><div className="px-2 text-xs uppercase text-white/70">Ou</div><div className="w-full border-t border-white/30" /></div>
                            
                            <div className="flex flex-col items-center">
                                <Button variant="outline" size="icon" aria-label="S'inscrire avec un e-mail" onClick={() => { setIsEmailFormVisible(true); setIsLogin(false); form.reset(); }} className="bg-white border-white text-black hover:bg-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                </Button>
                                <Button variant="link" className="text-white h-auto p-0 text-sm mt-8" onClick={() => { setIsEmailFormVisible(true); setIsLogin(true); form.reset(); }}>
                                    Connexion
                                </Button>
                            </div>
                        </div>

                        <div className={`w-full ${isEmailFormVisible ? 'block' : 'hidden'}`}>
                            <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel className="text-white/90">Email</FormLabel><FormControl><Input placeholder="nom@exemple.com" {...field} className="bg-white/10 border-white/30 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel className="text-white/90">Mot de passe</FormLabel><FormControl><Input type="password" placeholder="********" {...field} className="bg-white/10 border-white/30 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>)} />
                                {!isLogin && (<FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel className="text-white/90">Confirmer le mot de passe</FormLabel><FormControl><Input type="password" placeholder="********" {...field} className="bg-white/10 border-white/30 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>)} />)}
                                <Button type="submit" className="w-full !mt-10" disabled={isLoading || isGoogleLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLogin ? 'Se connecter' : "Créer un compte"}
                                </Button>
                            </form>
                            </Form>
                            <div className="mt-4 text-center">
                                <Button variant="link" className="text-white/80 hover:text-white" onClick={toggleForm}>
                                    {isLogin ? "Pas encore de compte ? Créez-en un" : "Vous avez déjà un compte ? Connectez-vous"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center md:hidden pb-4 flex-shrink-0">
                    <p className="text-[9px] text-white">
                        En vous inscrivant, vous acceptez notre <Link href="/settings/privacy-policy" className="underline">Politique de confidentialité</Link>.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
