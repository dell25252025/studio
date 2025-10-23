'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { PermissionState, Permissions } from '@capacitor/permissions';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestAllPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('Requesting all necessary permissions...');

          const permissionsToRequest = [
            { name: 'camera' as const }, 
            { name: 'geolocation' as const }, 
            { name: 'microphone' as const }
          ];

          const result = await Permissions.request({ permissions: permissionsToRequest });

          console.log('Permissions request result:', result);

          const allGranted = Object.values(result).every(
            (status: PermissionState) => status === 'granted'
          );

          if (allGranted) {
            console.log('All permissions granted.');
          } else {
            console.warn('Not all permissions were granted.');
            // Optionally, inform the user they might need to grant permissions manually.
            // toast({
            //   title: 'Permissions partielles',
            //   description: "Certaines fonctionnalités pourraient ne pas être disponibles. Veuillez vérifier les autorisations de l'application dans les paramètres de votre téléphone.",
            // });
          }

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

    // Delay the request slightly to ensure the app is fully initialized.
    const timeoutId = setTimeout(requestAllPermissions, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // This component does not render anything.
};

export default PermissionRequester;
