
import ChatClientPage from './chat-client-page';

export async function generateStaticParams() {
  // Nous ne voulons pas pré-générer de pages de chat au moment de la construction.
  // Cette fonction est requise pour les routes dynamiques avec `output: 'export'`.
  return [];
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClientPage otherUserId={params.id} />;
}
