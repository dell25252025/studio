
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserX, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SettingsHeader } from '@/components/settings/settings-header';

interface BlockedUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export default function BlockedUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load blocked users from localStorage when component mounts on the client
    try {
      const storedUsers = localStorage.getItem('blockedUsers');
      if (storedUsers) {
        setBlockedUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Failed to load blocked users from localStorage", error);
    }
  }, []);

  const handleUnblock = (userId: string) => {
    try {
      const updatedUsers = blockedUsers.filter(user => user.id !== userId);
      setBlockedUsers(updatedUsers);
      localStorage.setItem('blockedUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: 'Utilisateur débloqué',
        description: 'Vous pouvez de nouveau interagir avec cet utilisateur.',
      });
    } catch (error) {
       console.error("Failed to unblock user", error);
       toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de débloquer cet utilisateur.',
      });
    }
  };

  if (!isClient) {
    // Render nothing or a loading spinner on the server to avoid hydration mismatch
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="Utilisateurs bloqués" />
      <main className="px-2 py-4 md:px-4 pt-16">
            <div className="mx-auto max-w-2xl space-y-2">
                <Card>
                    <CardHeader className="p-3">
                        <CardTitle className="flex items-center gap-2 text-sm"><UserX className="h-4 w-4" /> Gérer les utilisateurs bloqués</CardTitle>
                        <CardDescription className="text-xs">Ils ne pourront plus vous contacter ni voir votre profil.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        {blockedUsers.length > 0 ? (
                            <ul className="space-y-2">
                                {blockedUsers.map(user => (
                                    <li key={user.id} className="flex items-center justify-between rounded-lg border p-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-xs">{user.name}</span>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm">Débloquer</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Débloquer {user.name} ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cet utilisateur pourra de nouveau voir votre profil, vous contacter et interagir avec vous. Êtes-vous sûr ?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleUnblock(user.id)}>
                                                        Confirmer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
                                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                                <h3 className="mt-2 font-semibold text-sm">Aucun utilisateur bloqué</h3>
                                <p className="mt-1 text-xs text-muted-foreground">Votre liste est vide.</p>
                           </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
