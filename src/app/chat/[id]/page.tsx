
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, MoreVertical, Ban, ShieldAlert, Image as ImageIcon, Mic, Camera, Smile, Circle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/app/actions';
import type { DocumentData } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Picker, { type EmojiClickData } from 'emoji-picker-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

// Mock messages for demonstration purposes
const initialMessages = [
  { id: 1, text: 'Salut ! Ton profil est super intéressant.', sender: 'other', image: null },
  { id: 2, text: 'Merci beaucoup ! Le tien aussi. Prêt pour l\'aventure ?', sender: 'me', image: null },
  { id: 3, text: 'Toujours ! Où rêves-tu d\'aller en premier ?', sender: 'other', image: null },
];

const CameraView = ({ onCapture, onClose }: { onCapture: (image: string) => void; onClose: () => void; }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Accès à la caméra refusé',
          description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
        });
      }
    };

    getCameraPermission();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <DialogContent className="p-0 m-0 w-full h-full max-w-full max-h-screen bg-black border-0 flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4">
                    <Alert variant="destructive">
                        <AlertTitle>Accès à la caméra requis</AlertTitle>
                        <AlertDescription>
                            Impossible d'accéder à la caméra. Veuillez vérifier les autorisations dans les paramètres de votre navigateur.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/50 hover:text-white"
                onClick={onClose}
             >
                <X className="h-6 w-6" />
             </Button>
            
            {hasCameraPermission && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <Button
                        size="icon"
                        className="w-20 h-20 rounded-full bg-white/30 border-4 border-white backdrop-blur-sm"
                        onClick={handleCapture}
                    >
                       <Circle className="w-12 h-12 text-white" fill="white" />
                    </Button>
                </div>
            )}
        </div>
    </DialogContent>
  );
};


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
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          sendImageMessage(result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCapturePhoto = (image: string) => {
    sendImageMessage(image);
    setIsCameraOpen(false);
  };

  const sendImageMessage = (imageData: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text: '', sender: 'me', image: imageData }]);
  };


  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prevMessage => prevMessage + emojiData.emoji);
  };


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: newMessage, sender: 'me', image: null },
      ]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);
  
    const handlePlaceholderAction = (feature: string) => {
    toast({ title: 'Fonctionnalité à venir', description: `${feature} sera bientôt disponible.` });
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

       <footer className="fixed bottom-0 z-10 w-full border-t bg-background/95 backdrop-blur-sm p-1">
        <form onSubmit={handleSendMessage}>
          <div className="flex w-full items-center gap-1 border-b pb-1">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Dis quelque chose de sympa !"
              className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-1 px-2 max-h-20 overflow-y-auto text-sm"
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="link"
              size="sm"
              className="text-primary font-semibold"
              disabled={!newMessage.trim()}
            >
              Envoyer
            </Button>
          </div>
          
          <div className="flex items-center">
            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Prendre une photo</span>
                </Button>
              </DialogTrigger>
              {isCameraOpen && <CameraView onCapture={handleCapturePhoto} onClose={() => setIsCameraOpen(false)} />}
            </Dialog>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Envoyer une image</span>
            </Button>
             <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Ajouter un emoji</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none mb-2">
                 <Picker onEmojiClick={handleEmojiClick} />
              </PopoverContent>
            </Popover>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlaceholderAction('Les messages vocaux')}>
              <Mic className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Envoyer un message vocal</span>
            </Button>
          </div>
        </form>
         <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />
      </footer>
    </div>
  );
}
