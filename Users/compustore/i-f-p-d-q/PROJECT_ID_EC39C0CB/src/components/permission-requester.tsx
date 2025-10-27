
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Demande de permission pour la caméra
          await Camera.requestPermissions();

          // Demande de permission pour la géolocalisation
          await Geolocation.requestPermissions();
          
          // Demande de permission pour le microphone via l'API web standard
          // C'est la méthode recommandée pour le micro, même dans Capacitor.
          await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        } catch (error: any) {
          // Gérer les erreurs spécifiques au micro
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
             console.log('Permission pour le microphone refusée.');
             // On peut choisir d'afficher un toast pour informer l'utilisateur
             toast({
                variant: 'destructive',
                title: 'Accès au microphone refusé',
                description: 'Les appels audio/vidéo ne fonctionneront pas sans cette autorisation.',
             });
          } else {
            console.error('Erreur lors de la demande de permissions:', error);
            toast({
              variant: 'destructive',
              title: 'Erreur de permissions',
              description: 'Impossible de demander toutes les autorisations nécessaires.',
            });
          }
        }
      }
    };

    // On attend un court instant avant de demander pour s'assurer que l'UI est prête
    const timeoutId = setTimeout(requestPermissions, 2000);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
