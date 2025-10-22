
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
    const requestAllPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('Requesting all necessary permissions...');
          
          // Demande de permission pour la caméra
          await Permissions.request({ name: 'camera' });
          
          // Demande de permission pour la géolocalisation
          await Permissions.request({ name: 'geolocation' });

          // Demande de permission pour le microphone
          await Permissions.request({ name: 'microphone' });

          console.log('Permission requests sent.');

        } catch (error) {
          console.error('Erreur lors de la demande de permissions:', error);
          toast({
            variant: 'destructive',
            title: 'Erreur de permissions',
            description: 'Impossible de demander les autorisations nécessaires.',
          });
        }
      }
    };

    // On attend un court instant avant de demander pour s'assurer que l'UI est prête
    const timeoutId = setTimeout(requestAllPermissions, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
