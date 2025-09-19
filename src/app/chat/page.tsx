
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import BottomNav from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';

// Données factices pour la liste des conversations
const mockConversations = [
  {
    id: 'user123',
    name: 'Sophia',
    avatarUrl: 'https://picsum.photos/seed/user1/200',
    lastMessage: 'Salut ! Ton profil est super intéressant.',
    timestamp: '10:42',
    unreadCount: 2,
  },
  {
    id: 'user456',
    name: 'James',
    avatarUrl: 'https://picsum.photos/seed/user2/200',
    lastMessage: 'Merci beaucoup ! Le tien aussi. Prêt pour l\'aventure ?',
    timestamp: 'Hier',
    unreadCount: 0,
  },
  {
    id: 'user789',
    name: 'Isabella',
    avatarUrl: 'https://picsum.photos/seed/user3/200',
    lastMessage: 'J\'ai vu qu\'on aimait tous les deux l\'Italie !',
    timestamp: 'Hier',
    unreadCount: 1,
  },
];


export default function InboxPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter(convo =>
    convo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      
      <main className="flex-1 overflow-y-auto pt-4 pb-24">
        <div className="container mx-auto max-w-2xl px-2">
            <div className="flex items-center p-2">
                <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold ml-2">Messages</h1>
            </div>
            <div className="relative p-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Rechercher une conversation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="mt-2">
                {filteredConversations.length > 0 ? (
                    <ul className="divide-y">
                    {filteredConversations.map((convo) => (
                        <li key={convo.id}>
                            <Link href={`/chat/${convo.id}`} className="flex items-center gap-4 p-3 transition-colors hover:bg-muted/50">
                                <Avatar className="h-12 w-12">
                                <AvatarImage src={convo.avatarUrl} alt={convo.name} />
                                <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 truncate">
                                <div className="flex items-baseline justify-between">
                                    <p className="font-semibold truncate">{convo.name}</p>
                                    <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm text-muted-foreground">
                                    {convo.lastMessage}
                                    </p>
                                    {convo.unreadCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {convo.unreadCount}
                                    </span>
                                    )}
                                </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="p-4 text-center text-sm text-muted-foreground">Aucune conversation trouvée.</p>
                )}
            </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
