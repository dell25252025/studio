
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserX, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SettingsHeader } from '@/components/settings/settings-header';

// Mock data for blocked users
const initialBlockedUsers = [
  { id: 'user123', name: 'Alexandre Dubois', avatarUrl: 'https://picsum.photos/seed/user1/200' },
  { id: 'user456', name: 'Marie Claire', avatarUrl: 'https://picsum.photos/seed/user2/200' },
];

export default function BlockedUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState(initialBlockedUsers);

  const handleUnblock = (userId: string) => {
    // In a real app, you would make an API call here to unblock the user.
    setBlockedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    toast({
      title: 'Utilisateur débloqué',
      description: 'Vous pouvez de nouveau interagir avec cet utilisateur.',
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SettingsHeader title="Utilisateurs bloqués" />
      <main className="px-2 py-4 md:px-4 pt-16">
            <div className="mx-auto max-w-2xl space-y-2">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="flex items-center gap-2 text-base"><UserX className="h-4 w-4" /> Gérer les utilisateurs bloqués</CardTitle>
                        <CardDescription className="text-xs">Les utilisateurs que vous bloquez ne pourront plus vous contacter ni voir votre profil.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
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
                           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                                <ShieldCheck className="h-10 w-10 text-muted-foreground" />
                                <h3 className="mt-3 font-semibold text-sm">Aucun utilisateur bloqué</h3>
                                <p className="mt-1 text-xs text-muted-foreground">Votre liste d'utilisateurs bloqués est vide.</p>
                           </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
