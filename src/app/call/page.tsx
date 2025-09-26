
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2, Video, VideoOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/lib/firebase-actions';
import type { DocumentData } from 'firebase/firestore';

function CallUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get('id');

  const [otherUser, setOtherUser] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState('calling'); // calling, connected, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    if (otherUserId) {
      getUserProfile(otherUserId).then(profile => {
        setOtherUser(profile);
        setLoading(false);
      });
    } else {
      router.push('/');
    }
  }, [otherUserId, router]);

  const handleEndCall = () => {
    setCallStatus('ended');
    // In a real app, you would disconnect the WebRTC connection here
    setTimeout(() => router.back(), 1000); // Go back after a short delay
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const otherUserName = otherUser?.firstName || 'Utilisateur';
  const otherUserImage = otherUser?.profilePictures?.[0] || `https://picsum.photos/seed/${otherUserId}/200`;

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between bg-slate-900 text-white p-8">
      {/* Background Image/Video (optional) */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${otherUserImage})` }}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-16">
        <Avatar className="h-32 w-32 border-4 border-white/50">
          <AvatarImage src={otherUserImage} alt={otherUserName} />
          <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-6 text-3xl font-bold">{otherUserName}</h1>
        <p className="mt-2 text-lg text-slate-300">
          {callStatus === 'calling' && 'Appel en cours...'}
          {callStatus === 'connected' && 'Connecté'}
          {callStatus === 'ended' && 'Appel terminé'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <VideoOff className="h-7 w-7" /> : <Video className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setIsDeafened(!isDeafened)}
          >
            {isDeafened ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
          </Button>
        </div>
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}

export default function CallPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
              <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        }>
            <CallUI />
        </Suspense>
    )
}
