'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { useToast } from '@/hooks/use-toast';

const PermissionRequester = () => {
  const { toast } = useToast();

  useEffect(() => {
    const requestPermissions = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const permStatus = await Geolocation.checkPermissions();
          if (permStatus.location !== 'granted') {
             await Geolocation.requestPermissions();
          }
        } catch (error: any) {
            console.error('Erreur lors de la demande de permission de géolocalisation:', error);
            toast({
                variant: 'destructive',
                title: 'Erreur de permission',
                description: 'Impossible de demander la permission de géolocalisation.',
            });
        }
      }
    };

    const timeoutId = setTimeout(requestPermissions, 1500);
    
    return () => clearTimeout(timeoutId);

  }, [toast]);

  return null;
};

export default PermissionRequester;
