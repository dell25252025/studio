import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
  webDir: 'out',
  server: {
    url: 'https://9000-firebase-studio-1757240494101.cluster-mwsteha33jfdowtvzffztbjcj6.cloudworkstations.dev',
    cleartext: true
  }
};

export default config;