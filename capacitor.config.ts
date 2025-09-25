import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app.v3',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // IMPORTANT: Replace with your actual local IP address
    url: 'http://192.168.1.99:3000', 
    cleartext: true
  }
};

export default config;
