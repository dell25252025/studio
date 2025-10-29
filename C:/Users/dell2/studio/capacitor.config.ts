
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // URL pour se connecter au serveur de développement Next.js depuis un appareil sur le même réseau.
    url: 'http://192.168.100.26:3000', 
    cleartext: true
  }
};

export default config;
