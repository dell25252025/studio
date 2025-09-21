
import ChatClientPage from './chat-client-page';

export const dynamicParams = true;
export async function generateStaticParams() {
  // We don't want to pre-render any chat pages at build time.
  // This function is required for dynamic routes with `output: 'export'`.
  return [];
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClientPage otherUserId={params.id} />;
}
