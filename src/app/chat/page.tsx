
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
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
      <header className="fixed top-0 z-20 w-full h-12 flex items-center justify-between border-b bg-background/95 px-2 py-1 backdrop-blur-sm md:px-4">
        <div className="flex items-center">
            <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-sm font-semibold ml-2">Messages</h1>
        </div>
        <div className="w-8"></div>
      </header>

      <main className="flex-1 overflow-y-auto pt-12 pb-4">
        <div className="container mx-auto max-w-2xl px-2">
            <div className="relative p-2 pt-4">
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
                            <Link href={`/chat/${convo.id}`} className="flex items-center gap-3 p-2 transition-colors hover:bg-muted/50">
                                <Avatar className="h-10 w-10">
                                <AvatarImage src={convo.avatarUrl} alt={convo.name} />
                                <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 truncate">
                                <div className="flex items-baseline justify-between">
                                    <p className="font-semibold truncate text-sm">{convo.name}</p>
                                    <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-xs text-muted-foreground">
                                    {convo.lastMessage}
                                    </p>
                                    {convo.unreadCount > 0 && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
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
    </div>
  );
}
