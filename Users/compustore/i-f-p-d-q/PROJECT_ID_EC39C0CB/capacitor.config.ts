import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // IMPORTANT: Remplacez par votre véritable adresse IP locale
    url: 'http://REMPLACER_PAR_VOTRE_IP:3000', 
    cleartext: true
  }
};

export default config;
