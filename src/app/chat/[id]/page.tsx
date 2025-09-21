
import ChatClientPage from './chat-client-page';

export async function generateStaticParams() {
  // Cette fonction est requise par Next.js lorsque "output: 'export'" est utilisé.
  // Nous retournons un tableau vide car nous ne voulons pas pré-générer
  // de pages de chat spécifiques au moment de la construction.
  // Les pages seront générées côté client lors de la navigation.
  return [];
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClientPage otherUserId={params.id} />;
}
