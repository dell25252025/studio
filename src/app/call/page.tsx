
'use client';

import { Suspense, useEffect, useState, useRef } } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader2, Video, VideoOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/lib/firebase-actions';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Configuration du serveur STUN de Google (public et gratuit)
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};


function CallUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [otherUser, setOtherUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState('calling'); // calling, connected, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false); // Gardé pour l'UI, non fonctionnel pour l'audio

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const callIdRef = useRef<string | null>(null);

  const callerId = auth.currentUser?.uid;
  const calleeId = searchParams.get('id');

  useEffect(() => {
    const initialize = async () => {
      if (!callerId || !calleeId) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Informations d\'appel manquantes.' });
        router.push('/');
        return;
      }
      
      const profile = await getUserProfile(calleeId);
      setOtherUser(profile);
      setLoading(false);

      // Initialiser WebRTC
      pc.current = new RTCPeerConnection(servers);
      remoteStream.current = new MediaStream();

      // Obtenir le flux audio local
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStream.current.getTracks().forEach((track) => {
          pc.current?.addTrack(track, localStream.current!);
        });
        if (localAudioRef.current && localStream.current) {
            localAudioRef.current.srcObject = localStream.current;
        }
      } catch (error) {
        console.error("Error getting user media", error);
        toast({ variant: 'destructive', title: 'Erreur de micro', description: 'Impossible d\'accéder au microphone.' });
        handleEndCall();
        return;
      }

      // Gérer les pistes audio distantes
      pc.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.current?.addTrack(track);
        });
        if (remoteAudioRef.current && remoteStream.current) {
            remoteAudioRef.current.srcObject = remoteStream.current;
            setCallStatus('connected');
        }
      };

      // Créer et gérer l'appel
      await createAndManageCall();
    };

    const createAndManageCall = async () => {
        if (!pc.current || !callerId || !calleeId) return;

        const callDocRef = collection(db, 'calls');
        const callDoc = await addDoc(callDocRef, { callerId, calleeId, status: 'ringing' });
        callIdRef.current = callDoc.id;

        const offerCandidates = collection(callDoc, 'offerCandidates');
        const answerCandidates = collection(callDoc, 'answerCandidates');

        pc.current.onicecandidate = (event) => {
            event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
        };

        const offerDescription = await pc.current.createOffer();
        await pc.current.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await updateDoc(callDoc, { offer });

        // Écouter la réponse
        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (!pc.current?.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.current?.setRemoteDescription(answerDescription);
                setCallStatus('connected');
            }
        });

        // Écouter les candidats ICE de la réponse
        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate);
                }
            });
        });
    }

    initialize();

    return () => {
      handleEndCall(false); // Cleanup on component unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndCall = async (notify = true) => {
    setCallStatus('ended');

    // Nettoyage WebRTC
    pc.current?.close();
    localStream.current?.getTracks().forEach((track) => track.stop());

    // Nettoyage Firestore
    if (callIdRef.current) {
      await deleteDoc(doc(db, 'calls', callIdRef.current));
    }
    
    pc.current = null;
    localStream.current = null;
    remoteStream.current = null;
    
    if(notify) {
        setTimeout(() => router.back(), 1000);
    }
  };
  
  const toggleMute = () => {
    if (localStream.current) {
        localStream.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
    }
  };


  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const otherUserName = otherUser?.firstName || 'Utilisateur';
  const otherUserImage = otherUser?.profilePictures?.[0] || `https://picsum.photos/seed/${calleeId}/200`;

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between bg-slate-900 text-white p-8">
      {/* Background Image/Video (optional) */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${otherUserImage})` }}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
      </div>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

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
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setIsVideoOn(!isVideoOn)}
            disabled // Vidéo non implémentée
          >
            {isVideoOn ? <VideoOff className="h-7 w-7" /> : <Video className="h-7 w-7" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setIsDeafened(!isDeafened)}
            disabled // Non implémenté
          >
            {isDeafened ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
          </Button>
        </div>
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
          onClick={() => handleEndCall()}
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

    