
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserX, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 py-1 backdrop-blur-sm">
            <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-base">Utilisateurs bloqués</h1>
            <div className="w-5"></div>
        </header>

        <main className="p-4 md:p-8">
            <div className="mx-auto max-w-2xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserX /> Gérer les utilisateurs bloqués</CardTitle>
                        <CardDescription>Les utilisateurs que vous bloquez ne pourront plus vous contacter ni voir votre profil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blockedUsers.length > 0 ? (
                            <ul className="space-y-4">
                                {blockedUsers.map(user => (
                                    <li key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline">Débloquer</Button>
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
                           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                                <ShieldCheck className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Aucun utilisateur bloqué</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Votre liste d'utilisateurs bloqués est vide.</p>
                           </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
