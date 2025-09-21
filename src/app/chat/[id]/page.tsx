
import ChatClientPage from './chat-client-page';

export async function generateStaticParams() {
  // Nous ne voulons pas pré-générer de pages de chat au moment de la construction.
  // Retourner un tableau vide est la bonne approche pour `output: 'export'`.
  // Les nouvelles pages de chat seront générées à la demande côté client.
  return [];
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClientPage otherUserId={params.id} />;
}
