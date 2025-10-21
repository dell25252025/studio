
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Demande de permission pour la géolocalisation
          console.log('Demande de la permission de géolocalisation...');
          const permissionStatus = await Geolocation.requestPermissions();
          console.log('Statut de la permission de géolocalisation:', permissionStatus.location);

          if (permissionStatus.location === 'denied') {
             toast({
              title: 'Permission refusée',
              description: 'La localisation a été refusée. Certaines fonctionnalités pourraient ne pas marcher.',
            });
          }

        } catch (error: any) {
            console.error('Erreur lors de la demande de permission de géolocalisation:', error);
            toast({
              variant: 'destructive',
              title: 'Erreur de permission',
              description: "Impossible de demander l'autorisation de localisation.",
            });
        }
      }
    };

    // On attend un court instant avant de demander pour s'assurer que l'UI est prête
    const timeoutId = setTimeout(requestLocationPermission, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null; // Ce composant ne rend rien visuellement
};

export default PermissionRequester;
