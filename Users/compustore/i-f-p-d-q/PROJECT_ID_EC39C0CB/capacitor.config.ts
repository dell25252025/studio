
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    // IMPORTANT: Replace with your computer's local IP address.
    // Find it on Windows with `ipconfig` or on macOS/Linux with `ifconfig`.
    url: 'http://192.168.100.26:3000', 
    cleartext: true
  }
};

export default config;
