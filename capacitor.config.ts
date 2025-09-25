import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app.v3',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.3:3000', // REMPLACEZ CETTE IP PAR LA VÔTRE
    cleartext: true
  }
};

export default config;
