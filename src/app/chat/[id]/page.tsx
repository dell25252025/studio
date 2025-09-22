// Ce fichier rend la route dynamique compatible avec `output: 'export'`.
// Next.js générera les pages pour les IDs retournés par generateStaticParams au moment du build.

// generateStaticParams est requis pour les routes dynamiques en mode export statique.
// Elle doit retourner un tableau d'objets contenant les `params` pour chaque page à générer.
export async function generateStaticParams() {
  // Pour l'exemple, nous pré-générons quelques pages.
  // Dans une vraie application, vous pourriez récupérer ces IDs depuis votre base de données.
  return [{ id: 'user123' }, { id: 'user456' }, { id: 'user789' }];
}

// dynamicParams = false indique à Next.js de ne pas essayer de générer
// de pages pour des IDs qui ne sont pas listés dans generateStaticParams.
// C'est une exigence pour `output: 'export'`.
export const dynamicParams = false;

// Composant de la page qui affiche l'ID.
export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Page de Chat</h1>
        <p className="text-muted-foreground">
          Ceci est une page statiquement générée pour l'ID de chat :
        </p>
        <p className="mt-2 rounded-md bg-secondary p-2 font-mono text-lg font-semibold">
          {params.id}
        </p>
      </div>
    </div>
  );
}
