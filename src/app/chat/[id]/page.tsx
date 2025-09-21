
import ChatClientPage from './chat-client-page';

// Indique à Next.js de ne pas essayer de générer de pages de chat
// spécifiques (comme /chat/user123) au moment de la construction.
export async function generateStaticParams() {
  return [];
}

// Empêche Next.js de tenter de générer des pages à la volée pour des ID
// qui n'ont pas été spécifiés dans generateStaticParams. Essentiel pour 'output: export'.
export const dynamicParams = false;

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClientPage otherUserId={params.id} />;
}
