
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestInitialPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Uniquement demander les permissions non-bloquantes au démarrage.
          // La géolocalisation est souvent moins intrusive.
          await Geolocation.requestPermissions();
          
          // Les permissions pour la caméra et le micro seront demandées
          // au moment de l'action (clic sur le bouton d'appel).
          // Cela évite de surcharger l'application au démarrage.

        } catch (error: any) {
            console.error('Erreur lors de la demande de permission de géolocalisation:', error);
            // On ne bloque pas l'utilisateur pour ça, on log juste l'erreur.
        }
      }
    };

    const timeoutId = setTimeout(requestInitialPermissions, 2000);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
