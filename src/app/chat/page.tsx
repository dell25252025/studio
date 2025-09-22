'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InboxPage from './inbox-page';
import ChatClientPage from './chat-client-page';
import { Loader2 } from 'lucide-react';

// A Suspense boundary is required because useSearchParams() suspends rendering.
function ChatPageContent() {
  const searchParams = useSearchParams();
  const otherUserId = searchParams.get('id');

  if (otherUserId) {
    return <ChatClientPage otherUserId={otherUserId} />;
  }

  return <InboxPage />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
