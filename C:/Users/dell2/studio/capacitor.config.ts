
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // Android Studio's emulator uses 10.0.2.2 to refer to the host machine's localhost.
    url: 'http://10.0.2.2:3000', 
    cleartext: true
  }
};

export default config;
