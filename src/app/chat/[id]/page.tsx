
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserProfile } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Mock messages for demonstration purposes
const initialMessages = [
  { id: 1, text: 'Salut ! Ton profil est super intéressant.', sender: 'other' },
  { id: 2, text: 'Merci beaucoup ! Le tien aussi. Prêt pour l\'aventure ?', sender: 'me' },
  { id: 3, text: 'Toujours ! Où rêves-tu d\'aller en premier ?', sender: 'other' },
];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const otherUserId = params.id as string;
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (otherUserId) {
      const fetchUserProfile = async () => {
        const profile = await getUserProfile(otherUserId);
        setOtherUser(profile);
      };
      fetchUserProfile();
    }
  }, [otherUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: newMessage, sender: 'me' },
      ]);
      setNewMessage('');
    }
  };
  
  const otherUserName = otherUser?.firstName || 'Utilisateur';
  const otherUserImage = otherUser?.profilePictures?.[0] || `https://picsum.photos/seed/${otherUserId}/200`;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed top-0 z-10 flex w-full items-center gap-2 border-b bg-background/95 px-2 py-2 backdrop-blur-sm md:px-4">
        <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarImage src={otherUserImage} alt={otherUserName} />
          <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="flex-1 truncate text-base font-semibold">{otherUserName}</h1>
      </header>

      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'other' && (
                <Avatar className="h-6 w-6">
                   <AvatarImage src={otherUserImage} alt={otherUserName} />
                   <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm md:text-base ${
                  message.sender === 'me'
                    ? 'rounded-br-none bg-primary text-primary-foreground'
                    : 'rounded-bl-none bg-secondary text-secondary-foreground'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 z-10 w-full border-t bg-background/95 p-2 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="h-9 w-9 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
