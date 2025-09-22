import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: '.next',
  server: {
    hostname: 'wanderlink.app',
    androidScheme: 'https'
  }
};

export default config;
