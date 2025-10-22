
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'src', // This forces Capacitor to create the assets directory.
  server: {
    url: 'http://192.168.100.26:3000', 
    cleartext: true
  }
};

export default config;
