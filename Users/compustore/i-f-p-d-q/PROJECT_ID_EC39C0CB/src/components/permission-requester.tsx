
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';
import { Permissions } from '@capacitor/permissions';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestInitialPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Demander les permissions une par une est une bonne pratique.
          // Ici, nous les demandons au démarrage pour simplifier.
          await Permissions.request({ name: 'camera' });
          await Permissions.request({ name: 'geolocation' });
          await Permissions.request({ name: 'microphone' });

        } catch (error: any) {
            console.error('Erreur lors de la demande de permissions:', error);
            // On informe l'utilisateur uniquement si quelque chose s'est mal passé,
            // sans être trop intrusif.
        }
      }
    };

    // On attend un court instant pour ne pas bloquer l'affichage initial de l'app.
    const timeoutId = setTimeout(requestInitialPermissions, 2000);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
