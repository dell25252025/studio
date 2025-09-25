
'use client';

import { useEffect } from 'react';
import { App, type BackButtonListenerEvent, type PluginListenerHandle } from '@capacitor/app';
import { usePathname, useRouter } from 'next/navigation';

const BackButtonHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let listener: PluginListenerHandle | null = null;

    const handleBackButton = (event: BackButtonListenerEvent) => {
      // Les pages qui devraient fermer l'application directement
      const exitPages = ['/', '/login'];
      
      if (exitPages.includes(pathname)) {
        App.exitApp();
      } else if (event.canGoBack) {
        window.history.back();
      } else {
         router.push('/');
      }
    };

    // On s'assure que le code ne s'exécute que sur le client
    if (typeof window !== 'undefined') {
      listener = App.addListener('backButton', handleBackButton);
    }

    return () => {
      // On utilise la méthode remove() de l'écouteur retourné
      listener?.remove();
    };
  }, [router, pathname]);

  return null; // Ce composant ne rend rien visuellement
};

export default BackButtonHandler;
