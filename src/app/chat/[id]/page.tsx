
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, MoreVertical, Ban, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserProfile } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

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
  const { toast } = useToast();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setSelectedImage(result);
          // For demonstration, we'll add it as a message directly.
          // In a real app, you'd upload this and get a URL.
          setMessages(prev => [...prev, { id: Date.now(), text: '', sender: 'me', image: result }]);
          setSelectedImage(null); // Reset after "sending"
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };


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
  
  const handleBlockUser = () => {
    toast({ title: `${otherUser?.firstName} a été bloqué(e).` });
  };

  const handleReportUser = () => {
    toast({ title: `Le profil de ${otherUser?.firstName} a été signalé.` });
  };
  
  const otherUserName = otherUser?.firstName || 'Utilisateur';
  const otherUserImage = otherUser?.profilePictures?.[0] || `https://picsum.photos/seed/${otherUserId}/200`;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="fixed top-0 z-10 flex w-full items-center gap-2 border-b bg-background/95 px-2 py-2 backdrop-blur-sm md:px-4">
        <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href={`/profile?id=${otherUserId}`} className="flex flex-1 items-center gap-2 truncate">
          <Avatar className="h-9 w-9">
            <AvatarImage src={otherUserImage} alt={otherUserName} />
            <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="flex-1 truncate text-base font-semibold">{otherUserName}</h1>
        </Link>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
                <div className="p-4 pb-0">
                    <div className="mt-3 h-full">
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full justify-start p-4 h-auto text-base" onClick={handleBlockUser}>
                                <Ban className="mr-2 h-5 w-5" /> Bloquer
                            </Button>
                        </DrawerClose>
                        <div className="my-2 border-t"></div>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full justify-start p-4 h-auto text-base" onClick={handleReportUser}>
                                <ShieldAlert className="mr-2 h-5 w-5" /> Signaler un abus
                            </Button>
                        </DrawerClose>
                    </div>
                </div>
                <div className="p-4">
                      <DrawerClose asChild>
                        <Button variant="secondary" className="w-full h-12 text-base">Annuler</Button>
                    </DrawerClose>
                </div>
            </div>
          </DrawerContent>
        </Drawer>
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
                className={`max-w-[70%] rounded-2xl text-sm md:text-base ${
                  message.text ? 'px-4 py-2' : 'p-1' // Less padding for images
                } ${
                  message.sender === 'me'
                    ? 'rounded-br-none bg-primary text-primary-foreground'
                    : 'rounded-bl-none bg-secondary text-secondary-foreground'
                }`}
              >
                {message.text}
                {message.image && (
                   <Image 
                     src={message.image} 
                     alt="Image envoyée" 
                     width={200} 
                     height={200}
                     className="rounded-xl object-cover"
                    />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 z-10 w-full border-t bg-background/95 p-2 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
           <Button type="button" variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 rounded-full" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Envoyer une image</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full h-9 px-4"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
