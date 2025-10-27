'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { Permissions } from '@capacitor/permissions';
import type { PermissionState } from '@capacitor/permissions';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
<<<<<<< HEAD
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
=======
    const requestAllPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('Requesting all necessary permissions...');

          const permissionsToRequest = ['camera', 'geolocation', 'microphone'] as const;

          const result = await Permissions.request({ permissions: permissionsToRequest });

          console.log('Permissions request result:', result);

          const allGranted = Object.values(result).every(
            (status: PermissionState) => status === 'granted'
          );

          if (allGranted) {
            console.log('All permissions granted.');
          } else {
            console.warn('Not all permissions were granted.');
            // You can optionally inform the user that some features might not be available
            // toast({
            //   title: 'Permissions partielles',
            //   description: "Certaines fonctionnalités pourraient ne pas être disponibles. Veuillez vérifier les autorisations de l'application dans les paramètres de votre téléphone.",
            //   duration: 5000,
            // });
          }

        } catch (error) {
          console.error('Erreur lors de la demande de permissions:', error);
          toast({
            variant: 'destructive',
            title: 'Erreur de permissions',
            description: 'Impossible de demander les autorisations nécessaires.',
          });
>>>>>>> 0d1192a5251aac79b7e20cc5776074323faf8589
        }
      }
    };

<<<<<<< HEAD
    // On attend un court instant avant de demander pour s'assurer que l'UI est prête
    const timeoutId = setTimeout(requestPermissions, 2000);
=======
    // Delay the request slightly to ensure the app is fully initialized and visible.
    const timeoutId = setTimeout(requestAllPermissions, 1500);
>>>>>>> 0d1192a5251aac79b7e20cc5776074323faf8589
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // This component does not render anything.
};

export default PermissionRequester;
