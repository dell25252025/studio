import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  server: {
    url: 'http://192.168.56.1:3000', 
    cleartext: true
  }
};

export default config;
