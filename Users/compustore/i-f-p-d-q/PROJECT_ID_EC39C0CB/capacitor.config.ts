import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  server: {
    // IMPORTANT: Remplacez par l'adresse IP locale ACTUELLE de votre ordinateur.
    // Assurez-vous que votre téléphone est sur le même réseau WiFi.
    url: 'http://192.168.1.99:3000', 
    cleartext: true
  }
};

export default config;
