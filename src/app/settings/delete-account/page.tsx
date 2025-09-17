
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { SettingsHeader } from '@/components/settings/settings-header';
import { auth } from '@/lib/firebase';
import { deleteUser } from 'firebase/auth';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const user = auth.currentUser;

    if (user) {
      try {
        await deleteUser(user);
        toast({
          title: 'Compte supprimé',
          description: 'Votre compte a été définitivement supprimé. Nous sommes tristes de vous voir partir.',
        });
        // Redirect to homepage or login page after deletion
        router.push('/');
      } catch (error: any) {
        console.error("Account deletion error:", error);
        let description = "Une erreur est survenue lors de la suppression de votre compte.";
        if (error.code === 'auth/requires-recent-login') {
          description = "Cette action nécessite une reconnexion récente. Veuillez vous déconnecter, vous reconnecter, puis réessayer.";
        }
        toast({
          variant: 'destructive',
          title: 'Échec de la suppression',
          description,
        });
        setIsDeleting(false);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Aucun utilisateur connecté. Impossible de supprimer le compte.',
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="Supprimer le compte" />
      <main className="space-y-6 px-2 py-4 md:px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Action irréversible
              </CardTitle>
              <CardDescription>
                La suppression de votre compte est définitive et ne peut pas être annulée.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Toutes vos données, y compris votre profil, vos messages, vos photos et vos matchs, seront supprimées de manière permanente. Cette action ne peut pas être annulée.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer mon compte définitivement
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr(e) ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Votre compte et toutes vos données seront supprimés. Personne ne pourra récupérer ce contenu.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Oui, supprimer mon compte
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
