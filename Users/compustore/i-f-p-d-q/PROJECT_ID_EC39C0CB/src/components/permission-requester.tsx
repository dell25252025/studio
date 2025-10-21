
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestEssentialPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Demande de permission pour la géolocalisation
          console.log('Demande de la permission de géolocalisation...');
          const locationStatus = await Geolocation.requestPermissions();
          console.log('Statut de la permission de géolocalisation:', locationStatus.location);

          if (locationStatus.location === 'denied') {
             toast({
              title: 'Permission de localisation refusée',
              description: 'La géolocalisation est importante. Vous pouvez l\'activer dans les paramètres de l\'application.',
            });
          }

          // Demande de permission pour le microphone
           console.log('Demande de la permission du microphone...');
           await navigator.mediaDevices.getUserMedia({ audio: true });
           console.log('Permission du microphone accordée ou déjà active.');
           
          // Demande de permission pour la caméra
           console.log('Demande de la permission de la caméra...');
           await navigator.mediaDevices.getUserMedia({ video: true });
           console.log('Permission de la caméra accordée ou déjà active.');


        } catch (error: any) {
            console.error('Erreur lors de la demande de permissions:', error);
            // On ne spamme pas l'utilisateur avec des toasts pour chaque permission refusée.
            // On loggue juste l'erreur.
        }
      }
    };

    // On attend un court instant avant de demander pour s'assurer que l'UI est prête
    const timeoutId = setTimeout(requestEssentialPermissions, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
