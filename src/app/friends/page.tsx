
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WanderlinkHeader from '@/components/wanderlink-header';
import BottomNav from '@/components/bottom-nav';
import { getFriends } from '@/app/actions';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { DocumentData } from 'firebase/firestore';

export default function FriendsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState<DocumentData[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchFriends(user.uid);
      } else {
        router.push('/login');
      }
    });

    const fetchFriends = async (uid: string) => {
      setLoading(true);
      try {
        const friendsList = await getFriends(uid);
        setFriends(friendsList);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return () => unsubscribe();
  }, [router]);

  const filteredFriends = friends.filter(friend =>
    friend.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {loading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : filteredFriends.length > 0 ? (
                        <ul className="space-y-3">
                        {filteredFriends.map((friend) => (
                            <li key={friend.id} className="flex items-center gap-3">
                                <Link href={`/profile?id=${friend.id}`} className="flex flex-1 items-center gap-3 min-w-0">
                                    <Avatar className="h-10 w-10">
                                    <AvatarImage src={friend.profilePictures?.[0]} alt={friend.firstName} />
                                    <AvatarFallback>{friend.firstName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="font-semibold truncate text-sm">{friend.firstName}</p>
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
