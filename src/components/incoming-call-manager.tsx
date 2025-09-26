
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getUserProfile } from '@/lib/firebase-actions';
import { Phone, PhoneOff, Video } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

interface CallData extends DocumentData {
    id: string;
    callerId: string;
    callerName?: string;
    callerImage?: string;
    type?: 'audio' | 'video';
}

const IncomingCallManager = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);

  useEffect(() => {
    if (!user) return;

    const callsRef = collection(db, 'calls');
    const q = query(callsRef, where('calleeId', '==', user.uid), where('status', '==', 'ringing'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const callDoc = snapshot.docs[0];
        const callerProfile = await getUserProfile(callDoc.data().callerId);
        
        setIncomingCall({
            id: callDoc.id,
            callerId: callDoc.data().callerId,
            callerName: callerProfile?.firstName || 'Quelqu\'un',
            callerImage: callerProfile?.profilePictures?.[0] || `https://picsum.photos/seed/${callDoc.data().callerId}/200`,
            ...callDoc.data()
        });
      } else {
        setIncomingCall(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleAcceptCall = () => {
    if (!incomingCall) return;
    const isVideo = incomingCall.type === 'video';
    router.push(`/call/receive?callId=${incomingCall.id}&video=${isVideo}`);
    setIncomingCall(null);
  };

  const handleDeclineCall = async () => {
    if (!incomingCall) return;
    const callDocRef = doc(db, 'calls', incomingCall.id);
    await updateDoc(callDocRef, { status: 'declined' });
    setIncomingCall(null);
    // The caller's page should observe this status change and terminate the call.
    // We can also just delete the document after a short delay.
    setTimeout(() => deleteDoc(callDocRef), 2000);
  };

  const isVideoCall = incomingCall?.type === 'video';

  return (
    <AlertDialog open={!!incomingCall}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={incomingCall?.callerImage} alt={incomingCall?.callerName} />
                <AvatarFallback>{incomingCall?.callerName?.charAt(0)}</AvatarFallback>
            </Avatar>
          <AlertDialogTitle className="pt-2">{incomingCall?.callerName} vous appelle...</AlertDialogTitle>
          <AlertDialogDescription className="flex items-center justify-center gap-2">
            Appel {isVideoCall ? 'vidéo' : 'audio'} entrant
            {isVideoCall && <Video className="h-4 w-4" />}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-4">
          <AlertDialogAction onClick={handleDeclineCall} className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90">
            <PhoneOff />
          </AlertDialogAction>
          <AlertDialogAction onClick={handleAcceptCall} className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700">
            <Phone />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default IncomingCallManager;
