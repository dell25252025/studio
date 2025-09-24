
'use client';

import { useEffect } from 'react';
import { App, type BackButtonListenerEvent } from '@capacitor/app';
import { usePathname, useRouter } from 'next/navigation';

const BackButtonHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

    const listener = App.addListener('backButton', handleBackButton);

    return () => {
      listener.remove();
    };
  }, [router, pathname]);

  return null; // Ce composant ne rend rien visuellement
};

export default BackButtonHandler;
