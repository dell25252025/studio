import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanderlink.app',
  appName: 'WanderLink',
<<<<<<< HEAD
  webDir: 'out'
=======
  webDir: 'out',
  server: {
    url: 'http://192.168.100.26:3000',
    cleartext: true,
  },
>>>>>>> 0d1192a5251aac79b7e20cc5776074323faf8589
};

export default config;
