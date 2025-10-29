'use client';

import { Permissions, type PermissionState } from '@capacitor/permissions';
import { Capacitor } from '@capacitor/core';

type PermissionName = 'camera' | 'microphone' | 'geolocation';

// Cette fonction unifiée demande une permission spécifique sur les plateformes natives.
export async function requestPermission(name: PermissionName): Promise<{ state: PermissionState }> {
  // Sur le web, nous laissons le navigateur gérer la demande via getUserMedia etc.
  // La permission sera donc accordée ou refusée par le navigateur à ce moment-là.
  if (!Capacitor.isNativePlatform()) {
    console.log(`Permission request for '${name}' on web is handled by the browser's API.`);
    // Pour le web, on ne peut pas savoir à l'avance, on suppose 'prompt' ou 'granted'
    // On retourne 'granted' pour ne pas bloquer le flux, le navigateur demandera la permission.
    try {
        const queryResult = await navigator.permissions.query({ name: name as PermissionName});
        return { state: queryResult.state as PermissionState };
    } catch (e) {
        // Certains navigateurs ou permissions ne supportent pas query.
        return { state: "granted" }; 
    }
  }

  try {
    // Vérifie d'abord l'état actuel de la permission
    let status = await Permissions.query({ name: name });

    // Si la permission est déjà accordée, pas besoin de demander à nouveau
    if (status.state === 'granted') {
      return status;
    }

    // Si la permission n'a jamais été demandée (prompt), on la demande
    if (status.state === 'prompt') {
      status = (await Permissions.request({ permissions: [name] }))[name];
    }
    
    // Si la permission a été refusée (denied), on ne peut pas la redemander via l'API.
    // L'utilisateur doit l'activer manuellement dans les paramètres de l'application.
    if (status.state === 'denied') {
        console.warn(`Permission for '${name}' was denied. User must enable it in settings.`);
    }

    return status;
  } catch (error) {
    console.error(`Error requesting permission for ${name}:`, error);
    return { state: 'denied' };
  }
}

// Cette fonction vérifie l'état d'une permission sans la demander.
export async function checkPermission(name: PermissionName): Promise<{ state: PermissionState }> {
  if (!Capacitor.isNativePlatform()) {
    try {
        const queryResult = await navigator.permissions.query({ name: name as PermissionName});
        return { state: queryResult.state as PermissionState };
    } catch (e) {
        return { state: 'granted' };
    }
  }
  try {
    const result = await Permissions.query({ name });
    return result;
  } catch (error) {
     console.error(`Error checking permission for ${name}:`, error);
     return { state: 'denied' };
  }
}
