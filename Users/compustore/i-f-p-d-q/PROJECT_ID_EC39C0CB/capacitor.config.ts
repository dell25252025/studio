import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // IMPORTANT: Remplacez par votre véritable adresse IP locale si elle a changé
    url: 'http://192.168.1.99:3000', 
    cleartext: true
  }
};

export default config;
