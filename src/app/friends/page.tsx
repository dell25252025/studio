
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WanderlinkHeader from '@/components/wanderlink-header';
import BottomNav from '@/components/bottom-nav';

// Données factices pour la liste d'amis
const initialFriends = [
  {
    id: 'user123',
    name: 'Sophia',
    avatarUrl: 'https://picsum.photos/seed/user1/200',
    status: 'En ligne',
  },
  {
    id: 'user456',
    name: 'James',
    avatarUrl: 'https://picsum.photos/seed/user2/200',
    status: 'Hors ligne',
  },
  {
    id: 'user789',
    name: 'Isabella',
    avatarUrl: 'https://picsum.photos/seed/user3/200',
    status: 'En ligne',
  },
];

export default function FriendsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = initialFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <WanderlinkHeader />
      <main className="flex-1 overflow-y-auto pt-16 pb-24">
        <div className="container mx-auto max-w-2xl px-2">
            <Card>
                <CardHeader>
                    <CardTitle>Mes Amis</CardTitle>
                    <CardDescription>Retrouvez ici les voyageurs avec qui vous avez connecté.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Rechercher un ami..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {filteredFriends.length > 0 ? (
                        <ul className="space-y-3">
                        {filteredFriends.map((friend) => (
                            <li key={friend.id} className="flex items-center gap-3">
                                <Link href={`/profile?id=${friend.id}`} className="flex flex-1 items-center gap-3 min-w-0">
                                    <Avatar className="h-10 w-10">
                                    <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="font-semibold truncate text-sm">{friend.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`h-2 w-2 rounded-full ${friend.status === 'En ligne' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {friend.status}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/chat?id=${friend.id}`)}>
                                    Message
                                </Button>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground mb-4">Vous n'avez aucun ami pour le moment.</p>
                            <Button onClick={() => router.push('/')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Découvrir des profils
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
