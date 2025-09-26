
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, sendEmailVerification, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailCheck, Send } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        if (user.emailVerified) {
          router.push('/create-profile');
        }
      } else {
        // If no user is logged in, they shouldn't be here
        router.push('/login');
      }
      setLoading(false);
    });

    // Check email verification status periodically
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          toast({
            title: "E-mail vérifié !",
            description: "Vous pouvez maintenant créer votre profil.",
          });
          router.push('/create-profile');
        }
      }
    }, 3000); // Check every 3 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router, toast]);

  const handleResendEmail = async () => {
    if (!currentUser) return;
    setIsResending(true);
    try {
      await sendEmailVerification(currentUser);
      toast({
        title: 'E-mail renvoyé',
        description: 'Veuillez vérifier votre boîte de réception.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de renvoyer l'e-mail de vérification.",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">Vérifiez votre adresse e-mail</CardTitle>
          <CardDescription>
            Un e-mail de vérification a été envoyé à <br />
            <span className="font-semibold text-foreground">{currentUser?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Veuillez cliquer sur le lien dans cet e-mail pour activer votre compte. Si vous ne le trouvez pas, vérifiez votre dossier de spam.
          </p>
          <Button onClick={handleResendEmail} disabled={isResending} className="w-full">
            {isResending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Renvoyer l'e-mail
          </Button>
          <Button variant="link" asChild>
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
