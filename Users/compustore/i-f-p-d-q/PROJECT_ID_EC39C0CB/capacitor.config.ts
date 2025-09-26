import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // This is the special IP address that the Android emulator uses
    // to connect to the host machine (your computer).
    url: 'http://10.0.2.2:3000', 
    cleartext: true
  }
};

export default config;
