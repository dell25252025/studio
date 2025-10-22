
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'src', // This forces Capacitor to create the assets directory.
  server: {
    url: 'http://192.168.100.26:3000', 
    cleartext: true
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '186522309970-13g4a6l03a4p97vj38m3d2tgdne924n0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
